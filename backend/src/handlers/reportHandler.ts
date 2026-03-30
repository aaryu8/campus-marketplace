// handlers/reportHandler.ts
import type { Request, Response } from 'express';
import { prisma } from '../db.js';
import { redisClient } from '../redis/redis.js';
import { adjustTrustScore, applyStrike, TRUST_DELTA } from '../utils/trustUtils.js';
import type { ModerationStatus, ReportReason } from '@prisma/client';

// ─── Thresholds ───────────────────────────────────────────────────────────────
const WARN_THRESHOLD       = 3;
const SUSPEND_THRESHOLD    = 7;
const RATE_LIMIT_MAX       = 3;    // default: 3 reports/hour
const RATE_LIMIT_MAX_LOW   = 1;    // trust < 40: only 1 report/hour
const RATE_LIMIT_WINDOW    = 3600;
const ABUSE_VIOLATIONS_MAX = 3;
const DISPUTE_TTL          = 72 * 60 * 60;

// Trust score gates
const TRUST_REPORTING_DISABLED = 20;  // below this: cannot report at all
const TRUST_RATE_LIMIT_REDUCED = 40;  // below this: tighter rate limit

const VALID_REASONS: ReportReason[] = [
  'spam', 'price_scam', 'duplicate', 'inappropriate', 'already_sold', 'other',
];

// ─── Helper: recalculate reportWeight from DB ─────────────────────────────────
async function recalculateWeight(productId: string): Promise<number> {
  const reports = await prisma.report.findMany({
    where:   { productId },
    include: { reporter: { select: { trustScore: true } } },
  });
  return reports.reduce((sum, r) => sum + r.reporter.trustScore / 100, 0);
}

// ─── Helper: apply moderation transition ─────────────────────────────────────
async function applyModerationTransition(
  productId:   string,
  ownerId:     string,
  from:        ModerationStatus,
  to:          ModerationStatus,
  reason:      string,
  triggeredBy: string | null
): Promise<void> {
  const now = new Date();

  await prisma.$transaction([
    prisma.product.update({
      where: { id: productId },
      data:  {
        moderationStatus: to,
        ...(from === 'clean' && { flaggedAt: now }),
      },
    }),
    prisma.moderationEvent.create({
      data: {
        productId,
        ...(triggeredBy !== null && { userId: triggeredBy }),
        fromStatus: from,
        toStatus:   to,
        reason,
      },
    }),
  ]);

  if (to === 'suspended' && from !== 'suspended') {
    await applyStrike(ownerId, TRUST_DELTA.LISTING_SUSPENDED);
  }

  await redisClient.del(`report_weight:${productId}`);
}

// ─── POST /api/marketplace/:productId/report ──────────────────────────────────
export async function reportProductHandler(req: Request, res: Response) {
  try {
    const reporterId = res.locals.user?.id as string | undefined;
    if (!reporterId) return res.status(401).json({ msg: 'Unauthorized' });

    const productId = req.params.productId as string;
    const { reason, note } = req.body as { reason: ReportReason; note?: string };

    if (!VALID_REASONS.includes(reason)) {
      return res.status(400).json({ msg: 'Invalid report reason' });
    }

    // ── Fetch reporter trust score first — gates everything ───
    const reporter = await prisma.user.findUnique({
      where:  { id: reporterId },
      select: { trustScore: true },
    });
    if (!reporter) return res.status(404).json({ msg: 'User not found' });

    // Trust gate: below 20 — reporting fully disabled
    if (reporter.trustScore < TRUST_REPORTING_DISABLED) {
      return res.status(403).json({
        msg: 'Your account has been restricted from reporting due to low trust score.',
        trustScore: reporter.trustScore,
      });
    }

    const product = await prisma.product.findUnique({
      where:  { id: productId },
      select: { id: true, ownerId: true, moderationStatus: true, status: true },
    });

    if (!product)                       return res.status(404).json({ msg: 'Listing not found' });
    if (product.ownerId === reporterId) return res.status(403).json({ msg: 'You cannot report your own listing' });
    if (product.status === 'sold')      return res.status(400).json({ msg: 'Cannot report a sold listing' });

    // ── Rate limiting — tighter for low trust users ───────────
    // trust < 40 → 1 report/hour, otherwise 3 reports/hour
    const effectiveLimit = reporter.trustScore < TRUST_RATE_LIMIT_REDUCED
      ? RATE_LIMIT_MAX_LOW
      : RATE_LIMIT_MAX;

    const rateLimitKey = `ratelimit:reports:${reporterId}`;
    const violationKey = `ratelimit:violations:${reporterId}`;
    const currentCount = (await redisClient.get<number>(rateLimitKey)) ?? 0;

    if (currentCount >= effectiveLimit) {
      const violations = await redisClient.incr(violationKey);
      await redisClient.expire(violationKey, 60 * 60 * 24);

      if (violations >= ABUSE_VIOLATIONS_MAX) {
        await adjustTrustScore(reporterId, TRUST_DELTA.RATE_LIMIT_ABUSE);
        await redisClient.del(violationKey);
      }

      return res.status(429).json({
        msg: reporter.trustScore < TRUST_RATE_LIMIT_REDUCED
          ? 'Your reporting is restricted due to low trust score. Try again later.'
          : 'Too many reports. Try again later.',
      });
    }

    // ── Duplicate check ───────────────────────────────────────
    const existing = await prisma.report.findUnique({
      where: { productId_reporterId: { productId, reporterId } },
    });
    if (existing) return res.status(409).json({ msg: 'You have already reported this listing' });

    // ── Write report ──────────────────────────────────────────
    await prisma.report.create({
      data: {
        productId,
        reporterId,
        reason,
        ...(note !== undefined && { note }),
      },
    });

    await redisClient.incr(rateLimitKey);
    await redisClient.expire(rateLimitKey, RATE_LIMIT_WINDOW);

    await prisma.product.update({
      where: { id: productId },
      data:  { lastReportAt: new Date() },
    });

    // ── Recalculate & update weight ───────────────────────────
    const newWeight = await recalculateWeight(productId);

    await prisma.product.update({
      where: { id: productId },
      data:  { reportWeight: newWeight },
    });

    await redisClient.set(`report_weight:${productId}`, newWeight, { ex: 60 * 60 });
    
    // ── Moderation transitions ────────────────────────────────
    const current = product.moderationStatus;

    if (newWeight >= SUSPEND_THRESHOLD && current !== 'suspended') {
      await applyModerationTransition(
        productId, product.ownerId,
        current, 'suspended',
        `Report weight reached ${newWeight.toFixed(2)} (threshold: ${SUSPEND_THRESHOLD})`,
        null
      );
      const contributors = await prisma.report.findMany({
        where:  { productId },
        select: { reporterId: true },
      });
      await Promise.all(
        contributors.map(c => adjustTrustScore(c.reporterId, TRUST_DELTA.REPORT_VALIDATED))
      );

    } else if (newWeight >= WARN_THRESHOLD && current === 'clean') {
      await applyModerationTransition(
        productId, product.ownerId,
        'clean', 'warned',
        `Report weight reached ${newWeight.toFixed(2)} (threshold: ${WARN_THRESHOLD})`,
        null
      );
    }

    return res.status(200).json({ msg: 'Report submitted' });

  } catch (error: any) {
    if (error?.code === 'P2002') {
      return res.status(409).json({ msg: 'You have already reported this listing' });
    }
    console.error('reportProductHandler error:', error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
}

// ─── POST /api/marketplace/:productId/dispute ─────────────────────────────────
export async function disputeReportHandler(req: Request, res: Response) {
  try {
    const userId = res.locals.user?.id as string | undefined;
    if (!userId) return res.status(401).json({ msg: 'Unauthorized' });

    const productId = req.params.productId as string;

    const product = await prisma.product.findUnique({
      where:  { id: productId },
      select: { id: true, ownerId: true, moderationStatus: true, disputeUsed: true },
    });

    if (!product)                   return res.status(404).json({ msg: 'Listing not found' });
    if (product.ownerId !== userId) return res.status(403).json({ msg: 'Forbidden' });
    if (product.moderationStatus !== 'suspended') {
      return res.status(400).json({ msg: 'Listing is not suspended' });
    }
    if (product.disputeUsed) {
      return res.status(400).json({ msg: 'Dispute right already used for this listing' });
    }

    const now = new Date();

    await prisma.$transaction([
      prisma.product.update({
        where: { id: productId },
        data:  {
          moderationStatus: 'warned',
          disputeUsed:      true,
          disputeAt:        now,
        },
      }),
      prisma.moderationEvent.create({
        data: {
          productId,
          userId,
          fromStatus: 'suspended',
          toStatus:   'warned',
          reason:     'Seller filed a dispute',
        },
      }),
    ]);

    await redisClient.set(`dispute_cooldown:${productId}`, userId, { ex: DISPUTE_TTL });
    await redisClient.del(`report_weight:${productId}`);

   return res.status(200).json({
  msg: 'Dispute filed. Your listing is now visible with a community warning. Your dispute right for this listing has been used — if it receives enough reports again, it will be suspended with no further recourse.',
});

  } catch (error) {
    console.error('disputeReportHandler error:', error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
}
// cron/moderation.ts
// Add this file alongside your existing cron/views.ts and import it in your server entry.
//
// Three jobs run on different schedules:
//   1. Time decay         — every hour  — restores warned/suspended listings with no new reports
//   2. Trust recovery     — every day   — +1 trust for accounts clean 30 days
//   3. False flag penalty — every hour  — -3 trust for reporters whose reports never reached threshold

import cron from 'node-cron';
import { prisma } from '../db.js';
import { redisClient } from '../redis/redis.js';
import { adjustTrustScore, TRUST_DELTA } from '../utils/trustUtils.js';

const WARN_THRESHOLD    = 3;
const SUSPEND_THRESHOLD = 7;

// ─── 1. Time decay ────────────────────────────────────────────────────────────
// warned   + no new report for 10 days → clean
// suspended + no new report for 30 days → warned (dispute right restored too)
async function runTimeDecay() {
  console.log('⚖️  Running moderation time decay...');
  const now = new Date();

  try {
    // warned → clean (10 days no new report)
    const warnCutoff = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
    const warnedProducts = await prisma.product.findMany({
      where: {
        moderationStatus: 'warned',
        OR: [
          { lastReportAt: { lte: warnCutoff } },
          { lastReportAt: null },
        ],
      },
      select: { id: true, ownerId: true, moderationStatus: true },
    });

    for (const p of warnedProducts) {
      await prisma.$transaction([
        prisma.product.update({
          where: { id: p.id },
          data:  {
            moderationStatus: 'clean',
            reportWeight:     0,
            flaggedAt:        null,
          },
        }),
        prisma.moderationEvent.create({
          data: {
            productId:  p.id,
            userId:     null,
            fromStatus: 'warned',
            toStatus:   'clean',
            reason:     'Time decay: no new reports for 10 days',
          },
        }),
      ]);
      await redisClient.del(`report_weight:${p.id}`);
      console.log(`  ✅ ${p.id} warned → clean`);
    }

    // suspended → warned (30 days no new report)
    const suspendCutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const suspendedProducts = await prisma.product.findMany({
      where: {
        moderationStatus: 'suspended',
        OR: [
          { lastReportAt: { lte: suspendCutoff } },
          { lastReportAt: null },
        ],
      },
      select: { id: true, ownerId: true },
    });

    for (const p of suspendedProducts) {
      await prisma.$transaction([
        prisma.product.update({
          where: { id: p.id },
          data:  {
            moderationStatus: 'warned',
            // Restore dispute right so seller can contest again after clean period
            disputeUsed:      false,
            disputeAt:        null,
          },
        }),
        prisma.moderationEvent.create({
          data: {
            productId:  p.id,
            userId:     null,
            fromStatus: 'suspended',
            toStatus:   'warned',
            reason:     'Time decay: no new reports for 30 days. Dispute right restored.',
          },
        }),
      ]);
      await redisClient.del(`report_weight:${p.id}`);
      console.log(`  ⚠️  ${p.id} suspended → warned (dispute restored)`);
    }

    console.log('✅ Time decay complete');
  } catch (err) {
    console.error('❌ Time decay failed:', err);
  }
}

// ─── 2. Trust recovery ────────────────────────────────────────────────────────
// +1 trust for users whose account has had no strikes for 30 days.
// "No strikes" = strikeCount unchanged AND no new reports filed against their listings.
async function runTrustRecovery() {
  console.log('💚 Running trust recovery...');
  try {
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Find users who have been updated (any field) more than 30 days ago
    // and have no suspended products — proxy for "clean account"
    const cleanUsers = await prisma.user.findMany({
      where: {
        updatedAt:  { lte: cutoff },
        trustScore: { lt: 150 },       // no need to process capped users
        products: {
          none: { moderationStatus: 'suspended' },
        },
      },
      select: { id: true },
    });

    for (const u of cleanUsers) {
      await adjustTrustScore(u.id, TRUST_DELTA.CLEAN_STREAK);
    }

    console.log(`✅ Trust recovery: bumped ${cleanUsers.length} users`);
  } catch (err) {
    console.error('❌ Trust recovery failed:', err);
  }
}

// ─── 3. False flag penalty ────────────────────────────────────────────────────
// Find reporters who filed reports more than 72h ago against listings that
// never reached WARN_THRESHOLD. Apply -3 trust per such report, then mark
// them so we don't double-penalise on next run.
//
// We track "penalised" via a Redis set rather than a DB column to keep the
// schema clean. Key: falseflag:penalised:{reportId} with a 30-day TTL.
async function runFalseFlagPenalty() {
  console.log('🚩 Running false flag penalty...');
  try {
    const cutoff = new Date(Date.now() - 72 * 60 * 60 * 1000); // 72h ago

    // Reports older than 72h on listings still below warn threshold
    const staleReports = await prisma.report.findMany({
      where: {
        createdAt: { lte: cutoff },
        product: {
          reportWeight:     { lt: WARN_THRESHOLD },
          moderationStatus: 'clean',
        },
      },
      select: { id: true, reporterId: true },
    });

    for (const report of staleReports) {
      const penalisedKey = `falseflag:penalised:${report.id}`;
      const alreadyDone  = await redisClient.get(penalisedKey);
      if (alreadyDone) continue;

      await adjustTrustScore(report.reporterId, TRUST_DELTA.REPORT_FALSE_FLAG);

      // Mark as penalised for 30 days — prevents double-penalty
      await redisClient.set(penalisedKey, '1', { ex: 30 * 24 * 60 * 60 });
    }

    console.log(`✅ False flag penalty applied to ${staleReports.length} stale reports`);
  } catch (err) {
    console.error('❌ False flag penalty failed:', err);
  }
}

// ─── Schedule ─────────────────────────────────────────────────────────────────
cron.schedule('0 * * * *',      runTimeDecay);        // every hour
cron.schedule('0 3 * * *',      runTrustRecovery);    // every day at 3am
cron.schedule('30 * * * *',     runFalseFlagPenalty); // every hour at :30

console.log('🚀 Moderation cron scheduled');
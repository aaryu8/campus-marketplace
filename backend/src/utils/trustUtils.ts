// utils/trustUtils.ts
// Centralised trust score mutations.
// Import this wherever you need to adjust a user's score — report handler, cron, etc.
// All changes are clamped between TRUST_FLOOR and TRUST_CAP.

import { prisma } from '../db.js';

export const TRUST_FLOOR = 0;
export const TRUST_CAP   = 150;

// Delta constants — change these in one place to tune the whole system
export const TRUST_DELTA = {
  REPORT_VALIDATED:   +2,   // reporter's listing reached threshold — their report was "right"
  REPORT_FALSE_FLAG:  -3,   // reporter filed a report, threshold never reached — false flag
  LISTING_SUSPENDED:  -15,  // seller's listing got suspended
  SOLD_ITEM:          +2,   // seller marked a listing as sold
  CLEAN_STREAK:       +1,   // cron: account clean for 30 days
  RATE_LIMIT_ABUSE:   -5,   // hit rate limit 3x in 24h — spam reporter pattern
} as const;

export async function adjustTrustScore(
  userId: string,
  delta: number,
  tx?: Parameters<Parameters<typeof prisma.$transaction>[0]>[0]
): Promise<void> {
  const db = tx ?? prisma;

  // Read current score
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { trustScore: true },
  });
  if (!user) return;

  const newScore = Math.min(
    TRUST_CAP,
    Math.max(TRUST_FLOOR, user.trustScore + delta)
  );

  await db.user.update({
    where: { id: userId },
    data:  { trustScore: newScore },
  });
}

// Increment strikeCount and apply trust penalty
export async function applyStrike(userId: string, delta: number): Promise<void> {
  const user = await prisma.user.findUnique({
    where:  { id: userId },
    select: { trustScore: true, strikeCount: true },
  });
  if (!user) return;

  const newScore = Math.min(TRUST_CAP, Math.max(TRUST_FLOOR, user.trustScore + delta));

  await prisma.user.update({
    where: { id: userId },
    data:  { trustScore: newScore, strikeCount: { increment: 1 } },
  });
}
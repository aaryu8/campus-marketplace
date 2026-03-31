
import { Router } from 'express';
import { prisma } from '../db.js';
import { redisClient } from '../redis/redis.js';

const router = Router();

router.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    await redisClient.ping();
    await fetch(`https://your-project-ref.supabase.co/storage/v1/bucket`, {
      headers: {
        Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        apikey: process.env.SUPABASE_ANON_KEY!,
      },
    });
    return res.status(200).json({ ok: true, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Health check failed:', error);
    return res.status(500).json({ ok: false });
  }
});

export default router;
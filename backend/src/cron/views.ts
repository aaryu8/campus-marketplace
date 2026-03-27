// cron/views.ts
import cron from 'node-cron';
import { redisClient } from '../redis/redis.js';
import { prisma } from '../db.js';

async function aggregateViewsToDB() {
  console.log('🔄 Running view aggregation...');

  try {
    // scan is safe for production — keys() can block and timeout on Upstash
    // cursor starts at 0, loop until Upstash returns 0 again (full scan complete)
    let cursor = 0;
    const allKeys: string[] = [];

    do {
      const [nextCursor, keys] = await redisClient.scan(cursor, {
        match: 'view_count:*',
        count: 100,
      });
      cursor = parseInt(nextCursor);
      allKeys.push(...keys);
    } while (cursor !== 0);

    if (allKeys.length === 0) {
      console.log('📭 No views to aggregate');
      return;
    }

    for (const key of allKeys) {
      const parts = key.split(':');
      const productId = parts[1];
      const datePart = parts[2];
      if (!productId || !datePart) continue;

      // get + del separately — getdel is not reliable across Upstash SDK versions
      const raw = await redisClient.get<number>(key);
      if (!raw) continue;

      // delete BEFORE writing to DB — if DB write fails, you lose the count
      // but this avoids double-counting on retry which is worse
      await redisClient.del(key);

      const viewCount = typeof raw === 'number'
        ? raw
        : parseInt(String(raw), 10);

      if (!viewCount || isNaN(viewCount) || viewCount === 0) continue;

      console.log(`📊 ${productId} — incrementing by ${viewCount}`);

      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: { views: { increment: viewCount } },
      });

      await prisma.user.update({
        where: { id: updatedProduct.ownerId },
        data: { totalViews: { increment: viewCount } },
      });

      // clean up the dedup set for this day
      await redisClient.del(`view:${productId}:${datePart}`);
    }

    console.log('✅ View aggregation complete');
  } catch (err) {
    console.error('❌ View aggregation failed:', err);
  }
}

// Runs every 5 minutes — change to '0 * * * *' for every hour in production
cron.schedule('* * * * *', aggregateViewsToDB);

console.log('🚀 View aggregation cron scheduled');
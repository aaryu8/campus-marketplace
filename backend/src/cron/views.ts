import { redisClient } from '../redis/redis.js';
import { prisma } from '../db.js';

async function aggregateViewsToDB() {
  try {
    const keys = await redisClient.keys('view_count:*');
    if (keys.length === 0) return;

    for (const key of keys) {
      const parts = key.split(':');
      const productId = parts[1];
      const datePart = parts[2];
      if (!productId) continue;

      // Atomic get + delete — no race condition
      const redisValue = await redisClient.getdel(key);
      const viewCount = typeof redisValue === 'number'
        ? redisValue
        : parseInt((redisValue as string) ?? '0', 10);

      if (!viewCount || viewCount === 0) continue;

      console.log(`Aggregating ${viewCount} views for product ${productId}`);

      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: { views: { increment: viewCount } },
      });

      await prisma.user.update({
        where: { id: updatedProduct.ownerId },
        data: { totalViews: { increment: viewCount } },
      });

      await redisClient.del(`view:${productId}:${datePart}`);
    }

    console.log('✅ View aggregation complete');
  } catch (err) {
    console.error('❌ Error aggregating views:', err);
  }
}

// Self-scheduling — waits for job to finish before next run
// No overlap, no missed executions
function scheduleAggregation(intervalMs: number) {
  const run = async () => {
    await aggregateViewsToDB();
    setTimeout(run, intervalMs); // schedule AFTER completion
  };

  // First run after one interval — avoids instant fire on nodemon restart
  setTimeout(run, intervalMs);
  console.log(`🚀 View aggregation scheduled every ${intervalMs / 1000}s`);
}

scheduleAggregation(10_000); // 10 seconds
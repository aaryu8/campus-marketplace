import cron from 'node-cron';
import { redisClient } from '../redis/redis.js';
import { prisma } from '../db.js';

/**
 * Aggregates Redis view counters into the DB
 */
async function aggregateViewsToDB() {
  try {
    // 1️⃣ Get all view keys
    const keys = await redisClient.keys('view_count:*');

    for (const key of keys) {
      // 2️⃣ Split key into parts
      const parts = key.split(':'); // ["view_count", productId, date]
      const productId = parts[1];
      const datePart = parts[2];

      if (!productId) continue; // safety check

      // 3️⃣ Get Redis value safely
      const redisValue = await redisClient.get(key) as string | null;

      // 4️⃣ Parse integer safely
      const viewCount = parseInt(redisValue ?? "0", 10);

      if (viewCount === 0) continue;

      console.log(`Aggregating ${viewCount} views for product ${productId}`);

      // 5️⃣ Increment product views
      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: { views: { increment: viewCount } },
      });

      // 6️⃣ Increment owner total views
      await prisma.user.update({
        where: { id: updatedProduct.ownerId },
        data: { totalViews: { increment: viewCount } },
      });

      // 7️⃣ Delete Redis keys after aggregation
      await redisClient.del(key);
      await redisClient.del(`view:${productId}:${datePart}`);
    }

    console.log('✅ View aggregation complete');
  } catch (err) {
    console.error('Error aggregating views:', err);
  }
}

/**
 * Schedule the aggregation using node-cron
 * Example: every 10 seconds for testing
 */
cron.schedule('*/10 * * * * *', async () => {
  console.log('🔄 Running Redis → DB aggregation cron job...');
  await aggregateViewsToDB();
});
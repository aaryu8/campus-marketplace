-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "totalViews" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Product_views_idx" ON "Product"("views");

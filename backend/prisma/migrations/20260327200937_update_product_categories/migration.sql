/*
  Warnings:

  - Changed the type of `category` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `condition` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('general', 'books', 'electronics', 'furniture', 'clothes', 'tickets', 'sports', 'transport', 'hostel');

-- CreateEnum
CREATE TYPE "Condition" AS ENUM ('new', 'like_new', 'good', 'fair', 'poor');

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "category",
ADD COLUMN     "category" "Category" NOT NULL,
DROP COLUMN "condition",
ADD COLUMN     "condition" "Condition" NOT NULL;

-- CreateIndex
CREATE INDEX "Product_category_idx" ON "Product"("category");

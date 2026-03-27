/*
  Warnings:

  - Added the required column `branch` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `college` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('active', 'paused', 'sold');

-- CreateEnum
CREATE TYPE "College" AS ENUM ('MAIT', 'DTU', 'IITD', 'GGSIPU', 'MSIT', 'NSUT', 'IIITD', 'BVCOE');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "status" "ProductStatus" NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "branch" TEXT NOT NULL,
ADD COLUMN     "college" "College" NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "Product_status_idx" ON "Product"("status");

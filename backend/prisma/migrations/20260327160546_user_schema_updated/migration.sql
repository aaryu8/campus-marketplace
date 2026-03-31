/*
  Warnings:

  - The `branch` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Branch" AS ENUM ('CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE', 'BT', 'CHE', 'MAC', 'NotSpecified');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "branch",
ADD COLUMN     "branch" "Branch" DEFAULT 'NotSpecified',
ALTER COLUMN "year" DROP NOT NULL,
ALTER COLUMN "year" SET DEFAULT 0;

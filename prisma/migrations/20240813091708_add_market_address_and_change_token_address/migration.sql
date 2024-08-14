/*
  Warnings:

  - Added the required column `market_address` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token_address` to the `properties` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "market_address" TEXT NOT NULL,
ADD COLUMN     "token_address" TEXT NOT NULL;

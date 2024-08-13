/*
  Warnings:

  - You are about to drop the column `createdBy` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `properties` table. All the data in the column will be lost.
  - Added the required column `created_by` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_by` to the `properties` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "properties" DROP COLUMN "createdBy",
DROP COLUMN "updatedBy",
ADD COLUMN     "created_by" TEXT NOT NULL,
ADD COLUMN     "updated_by" TEXT NOT NULL;

/*
  Warnings:

  - You are about to drop the column `created_by` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `properties` table. All the data in the column will be lost.
  - Added the required column `createdBy` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedBy` to the `properties` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "properties" DROP COLUMN "created_by",
DROP COLUMN "updated_by",
ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "updatedBy" TEXT NOT NULL;

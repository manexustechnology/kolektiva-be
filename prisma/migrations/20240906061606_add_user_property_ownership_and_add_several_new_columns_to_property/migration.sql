/*
  Warnings:

  - You are about to drop the column `createdBy` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `properties` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[wallet_address]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `created_by` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_by` to the `properties` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "properties" DROP COLUMN "createdBy",
DROP COLUMN "updatedBy",
ADD COLUMN     "chain_id" INTEGER,
ADD COLUMN     "created_by" TEXT NOT NULL,
ADD COLUMN     "is_aftermarket" BOOLEAN,
ADD COLUMN     "is_featured" BOOLEAN,
ADD COLUMN     "is_upcoming" BOOLEAN,
ADD COLUMN     "latitude" TEXT,
ADD COLUMN     "longitude" TEXT,
ADD COLUMN     "token_name" TEXT,
ADD COLUMN     "token_symbol" TEXT,
ADD COLUMN     "total_supply" INTEGER,
ADD COLUMN     "updated_by" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "user_property_ownerships" (
    "wallet_address" TEXT NOT NULL,
    "property_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_property_ownerships_pkey" PRIMARY KEY ("wallet_address","property_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_property_ownerships_wallet_address_property_id_key" ON "user_property_ownerships"("wallet_address", "property_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_wallet_address_key" ON "users"("wallet_address");

-- AddForeignKey
ALTER TABLE "user_property_ownerships" ADD CONSTRAINT "user_property_ownerships_wallet_address_fkey" FOREIGN KEY ("wallet_address") REFERENCES "users"("wallet_address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_property_ownerships" ADD CONSTRAINT "user_property_ownerships_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

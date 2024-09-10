-- AlterTable
ALTER TABLE "properties" 
ADD COLUMN     "chain_id" INTEGER,
ADD COLUMN     "is_aftermarket" BOOLEAN,
ADD COLUMN     "token_name" TEXT,
ADD COLUMN     "token_symbol" TEXT,
ADD COLUMN     "total_supply" INTEGER;

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

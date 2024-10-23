-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "google_map_url" TEXT,
ADD COLUMN     "tx_hash" TEXT,
ALTER COLUMN "phase" SET DEFAULT 'draft';

-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "property_data" JSONB;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "finish_onboarding" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "invite_code" TEXT,
ADD COLUMN     "onboarding_step" BIGINT NOT NULL DEFAULT 1,
ADD COLUMN     "point" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "referral_code" TEXT,
ADD COLUMN     "referral_code_limit" INTEGER,
ADD COLUMN     "zkme_verification" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "referrals" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "referral_user_id" UUID NOT NULL,
    "invited_user_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "referrals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "image_url" TEXT,
    "author_name" TEXT NOT NULL,
    "author_username" TEXT,
    "title" TEXT,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "reward_point" BIGINT NOT NULL,
    "total_reward" BIGINT NOT NULL DEFAULT 0,
    "campaign_link" TEXT,
    "cta_button" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "completed_quests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "quest_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "reward_point" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "completed_quests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "referrals_invited_user_id_key" ON "referrals"("invited_user_id");

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referral_user_id_fkey" FOREIGN KEY ("referral_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_invited_user_id_fkey" FOREIGN KEY ("invited_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "completed_quests" ADD CONSTRAINT "completed_quests_quest_id_fkey" FOREIGN KEY ("quest_id") REFERENCES "quests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "completed_quests" ADD CONSTRAINT "completed_quests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

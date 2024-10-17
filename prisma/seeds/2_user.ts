import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function run() {
  const users = [
    {
      walletAddress: '0xuser1234567890abcdef1234567890abcdef1234',
      inviteCode: 'INVITE123',
      referralCode: 'REFERRAL123',
      referralCodeLimit: 5,
      point: 100,
      onboardingStep: 2,
      finishOnboarding: true,
      zkmeVerification: true,
      lastActive: new Date('2023-10-01T10:00:00Z'),
    },
    {
      walletAddress: '0xuser234567890abcdef1234567890abcdef12345',
      inviteCode: 'INVITE234',
      referralCode: 'REFERRAL234',
      referralCodeLimit: 10,
      point: 200,
      onboardingStep: 3,
      finishOnboarding: false,
      zkmeVerification: false,
      lastActive: new Date('2023-09-15T12:00:00Z'),
    },
    {
      walletAddress: '0xuser34567890abcdef1234567890abcdef123456',
      inviteCode: 'INVITE345',
      referralCode: 'REFERRAL345',
      referralCodeLimit: 15,
      point: 300,
      onboardingStep: 1,
      finishOnboarding: false,
      zkmeVerification: true,
      lastActive: new Date('2023-08-20T14:00:00Z'),
    },
    {
      walletAddress: '0xuser4567890abcdef1234567890abcdef1234567',
      inviteCode: 'INVITE456',
      referralCode: 'REFERRAL456',
      referralCodeLimit: 20,
      point: 400,
      onboardingStep: 4,
      finishOnboarding: true,
      zkmeVerification: false,
      lastActive: new Date('2023-07-10T16:00:00Z'),
    },
    {
      walletAddress: '0xuser567890abcdef1234567890abcdef12345678',
      inviteCode: 'INVITE567',
      referralCode: 'REFERRAL567',
      referralCodeLimit: 25,
      point: 500,
      onboardingStep: 5,
      finishOnboarding: true,
      zkmeVerification: true,
      lastActive: new Date('2023-06-05T18:00:00Z'),
    },
  ];

  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }

  console.log('User seeds have been inserted.');
}

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function run() {
  const userActivities = [
    {
      activity: 'buy',
      activityType: 'INITIAL_OFFERING_PURCHASE',
      amount: 1000,
      price: 500000,
      txHash: '0xtxhash1234567890abcdef1234567890abcdef1234',
    },
    // {
    //   activity: 'sell',
    //   activityType: 'ORDER_FULFILLED',
    //   amount: 500,
    //   price: 250000,
    //   txHash: '0xtxhash234567890abcdef1234567890abcdef1235',
    // },
    {
      activity: 'buy',
      activityType: 'ORDER_PLACED',
      amount: 1500,
      price: 750000,
      txHash: '0xtxhash34567890abcdef1234567890abcdef1236',
    },
    {
      activity: 'sell',
      activityType: 'ORDER_PLACED',
      amount: 1500,
      price: 750000,
      txHash: '0xtxhash34567890abcdef1234567890abcdef1236',
    },
    // {
    //   activity: 'sell',
    //   activityType: 'ORDER_CANCELLED',
    //   amount: 200,
    //   price: 100000,
    //   txHash: '0xtxhash4567890abcdef1234567890abcdef1237',
    // },
    {
      activity: 'buy',
      activityType: 'INSTANT_TRADE',
      amount: 3000,
      price: 1500000,
      txHash: '0xtxhash567890abcdef1234567890abcdef1238',
    },
    {
      activity: 'sell',
      activityType: 'INSTANT_TRADE',
      amount: 3000,
      price: 1500000,
      txHash: '0xtxhash567890abcdef1234567890abcdef1238',
    },
  ];

  const users = await prisma.user.findMany();
  const properties = await prisma.property.findMany({
    where: {
      tokenName: {
        in: ['PropertyToken1', 'PropertyToken2'],
      },
    },
  });

  //   console.log('users:\n', users);
  //   console.log('properties:\n', properties);

  for (const user of users) {
    for (const property of properties) {
      for (const activity of userActivities) {
        await prisma.userActivity.create({
          data: {
            userId: user.id,
            propertyId: property.id,
            activity: activity.activity,
            activityType: activity.activityType,
            amount: BigInt(activity.amount),
            price: BigInt(activity.price),
            txHash: activity.txHash,
            createdAt: new Date(
              Date.now() - Math.floor(Math.random() * 10000000000),
            ), // Random date
          },
        });
      }
    }
  }

  console.log('User activity seeds have been inserted.');
}

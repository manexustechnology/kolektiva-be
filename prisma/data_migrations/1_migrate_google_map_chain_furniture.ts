import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function run() {
  console.log('Starting to update properties...');
  const properties = await prisma.property.findMany({
    where: {
      googleMapUrl: null,
      NOT: {
        propertyData: undefined,
      },
    },
    take: 5, // Limit the query to 5 properties
  });

  console.log(`Found ${properties.length} properties to update.`);

  for (const property of properties) {
    await updateProperty(property);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 second between updates to reduce load
  }

  console.log('Finished updating properties.');
}

async function updateProperty(property) {
  let propertyData = { ...(property.propertyData as any) };
  const googleMapUrl =
    propertyData?.propertyDetails?.propertySummary?.googleMapUrl;

  propertyData = await updateFurniture(property.id, propertyData); // Ensure furniture update is awaited
  propertyData = updateChain(propertyData);

  await prisma.property.update({
    where: { id: property.id },
    data: {
      chainId: propertyData.chainId,
      googleMapUrl: googleMapUrl,
      propertyData: propertyData,
    },
  });
  console.log(`Updated property ${property.id} successfully.`);
}

async function updateFurniture(propertyId, propertyData) {
  const furnitureString =
    propertyData?.propertyDetails?.propertyDetails?.furniture;
  if (typeof furnitureString === 'string' && furnitureString.length > 0) {
    const furnitureArray = furnitureString
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    propertyData = {
      ...propertyData,
      propertyDetails: {
        ...propertyData.propertyDetails,
        propertyDetails: {
          ...propertyData.propertyDetails.propertyDetails,
          furniture: furnitureArray,
        },
      },
    };
    console.log(`Inserting furniture for property ${propertyId}`);
    // Use Promise.all to wait for all furniture updates to complete before proceeding
    await Promise.all(
      furnitureArray.map((item) =>
        prisma.propertyFacility.create({
          data: {
            propertyId: propertyId,
            type: 'OTHER',
            facility: item,
            isHighlight: false,
          },
        }),
      ),
    );
  }
  return propertyData;
}

function updateChain(propertyData) {
  return {
    ...propertyData,
    chain: propertyData.chain || {
      chainId: 4202,
      chainName: 'Lisk Sepolia',
    },
  };
}

run();

import { PrismaClient } from '@prisma/client';

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
  });

  console.log(`Found ${properties.length} properties to update.`);

  await Promise.all(properties.map(updateProperty));
  console.log('Finished updating properties.');
}

async function updateProperty(property) {
  let propertyData = { ...(property.propertyData as any) };
  const googleMapUrl =
    propertyData?.propertyDetails?.propertySummary?.googleMapUrl;

  propertyData = updateFurniture(property.id, propertyData);
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

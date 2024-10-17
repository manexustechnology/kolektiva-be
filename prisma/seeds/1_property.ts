import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function run() {
  const properties = [
    {
      marketAddress: '0x1234567890abcdef1234567890abcdef12345678',
      tokenAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
      propertyOwnerAddress: '0xowner1234567890abcdef1234567890abcdef12',
      tokenName: 'PropertyToken1',
      tokenSymbol: 'PT1',
      totalSupply: 1000000,
      salePrice: 500000,
      address: '123 Main St',
      location: 'Downtown',
      city: 'Metropolis',
      state: 'State1',
      country: 'Country1',
      type: 'Residential',
      chainId: 1,
      latitude: '40.7128',
      longitude: '-74.0060',
      description: 'A beautiful residential property in the heart of the city.',
      status: 'visible',
      phase: 'intiial-offering',
      isFeatured: true,
      isUpcoming: false,
      isAftermarket: true,
      createdBy: 'admin',
      updatedBy: 'admin',
      propertyData: { bedrooms: 3, bathrooms: 2 },
      isApproved: true,
    },
    {
      marketAddress: '0xabcdef1234567890abcdef1234567890abcdef34',
      tokenAddress: '0x1234567890abcdef1234567890abcdef12345690',
      propertyOwnerAddress: '0xownerabcdef1234567890abcdef1234567890ab',
      tokenName: 'PropertyToken2',
      tokenSymbol: 'PT2',
      totalSupply: 2000000,
      salePrice: 750000,
      address: '456 Elm St',
      location: 'Suburbia',
      city: 'Gotham',
      state: 'State2',
      country: 'Country2',
      type: 'Commercial',
      chainId: 2,
      latitude: '34.0522',
      longitude: '-118.2437',
      description: 'A prime commercial property with excellent amenities.',
      status: 'visible',
      phase: 'upcoming',
      isFeatured: false,
      isUpcoming: true,
      isAftermarket: false,
      createdBy: 'admin',
      updatedBy: 'admin',
      propertyData: { squareFeet: 5000, parkingSpaces: 10 },
      isApproved: false,
    },
  ];

  for (const property of properties) {
    await prisma.property.create({
      data: property,
    });
  }

  console.log('Property seeds have been inserted.');
}

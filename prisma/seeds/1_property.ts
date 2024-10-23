import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

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
      chainId: 31337,
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
      googleMapUrl: `https://www.google.com/maps/search/?api=1&query=40.7128,-74.0060`,
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
      chainId: 31337,
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
      googleMapUrl: `https://www.google.com/maps/search/?api=1&query=34.0522,-118.2437`,
    },
  ];

  for (const property of properties) {
    await prisma.property.create({
      data: property,
    });
  }

  console.log('Property seeds have been inserted.');
}

import { Injectable } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property-body.dto';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { UpdatePropertyDto } from './dto/update-property-body.dto';
import { ListPropertyQueryDto } from './dto/list-property-query.dto';
import { KolektivaContractService } from '../kolektiva-contract/kolektiva-contract.service';

import * as dotenv from 'dotenv';
import { Address } from 'viem';
dotenv.config();

@Injectable()
export class PropertyService {
  constructor(
    private prisma: PrismaService,
    private kolektivaContract: KolektivaContractService,
  ) {}

  async create(createPropertyDto: CreatePropertyDto) {
    const { facilities, images, ...propertyData } = createPropertyDto;
    const tokenSymbol = await this.generateTokenSymbol();

    const { logs } = await this.kolektivaContract.createProperty({
      chainId: propertyData.chainId,
      name: propertyData.tokenName,
      symbol: tokenSymbol,
      propertyType: propertyData.type,
      country: propertyData.country,
      state: propertyData.state,
      city: propertyData.city,
      location: propertyData.location,
      totalSupply: propertyData.totalSupply,
      salePrice: propertyData.salePrice,
      propertyOwnerAddress: process.env.DEPLOYER_ADDRESS! as Address,
    });

    return await this.prisma.property.create({
      data: {
        propertyOwnerAddress: process.env.DEPLOYER_ADDRESS! as Address,
        marketAddress: logs[0].args.marketAddress,
        tokenAddress: logs[0].args.tokenAddress,
        tokenSymbol,
        ...propertyData,
        facilities: {
          create: facilities,
        },
        images: {
          create: images,
        },
      },
      include: {
        facilities: true,
        images: true,
      },
    });
  }

  async findAll(request: ListPropertyQueryDto) {
    const { sort, location, propertyType } = request;

    const whereClause: any = {};

    if (location && location !== 'All') {
      whereClause.OR = [{ state: location }, { city: location }];
    }

    if (propertyType && propertyType !== 'All') {
      whereClause.type = propertyType;
    }

    const orderByClause: any[] = [];

    if (sort === 'Featured') {
      orderByClause.push({ isFeatured: 'desc' });
    } else if (sort === 'Newest') {
      orderByClause.push({ createdAt: 'desc' });
    } else if (sort === 'Oldest') {
      orderByClause.push({ createdAt: 'asc' });
    }

    return this.prisma.property.findMany({
      where: whereClause,
      orderBy: orderByClause,
      include: {
        facilities: true,
        images: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.property.findUnique({
      where: { id },
      include: {
        facilities: true,
        images: true,
      },
    });
  }

  async update(id: string, updatePropertyDto: UpdatePropertyDto) {
    const { facilities, images, ...propertyData } = updatePropertyDto;

    return this.prisma.property.update({
      where: { id },
      data: {
        ...propertyData,
        facilities: {
          deleteMany: {},
          create: facilities,
        },
        images: {
          deleteMany: {},
          create: images,
        },
      },
      include: {
        facilities: true,
        images: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.property.delete({
      where: { id },
      include: {
        facilities: true,
        images: true,
      },
    });
  }

  private async generateTokenSymbol() {
    const count = (await this.prisma.property.count()) + 1;
    const prefix = 'KLTV';
    const maxLimit = 9999; // KLV0001 format

    if (count <= maxLimit) {
      return prefix + count.toString().padStart(4, '0');
    }
    return prefix + count.toString();
  }
}

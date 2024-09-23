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

    // Create market and token contracts onchain
    const { logs, ...others } = await this.kolektivaContract.createProperty({
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
    console.log('createProp:', others);

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
    const { sort, location, propertyType, search, chainId } = request;

    const whereClause: any = { AND: [] };

    if (chainId && !isNaN(Number(chainId))) {
      whereClause.chainId = Number(chainId);
    }

    if (location && location !== 'All') {
      whereClause.AND.push({ OR: [{ state: location }, { city: location }] });
    }

    if (propertyType && propertyType !== 'All') {
      whereClause.type = propertyType;
    }

    if (search && search.trim()) {
      whereClause.AND.push({
        OR: [
          { tokenName: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } },
          { tokenSymbol: { contains: search, mode: 'insensitive' } },
        ],
      });
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

  async approveMarket(id: string) {
    const propertyData = await this.findOne(id);
    if (!propertyData) {
      throw new Error(`Property id ${id} not found`);
    }

    // Approve the market allowance onchain
    return await this.kolektivaContract.approveMarket({
      chainId: propertyData.chainId,
      name: propertyData.tokenName,
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

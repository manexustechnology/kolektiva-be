import { Injectable } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property-body.dto';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { UpdatePropertyDto } from './dto/update-property-body.dto';
import { ListPropertyQueryDto } from './dto/list-property-query.dto';
import { Address } from 'viem';
import { Prisma } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class PropertyService {
  constructor(private prisma: PrismaService) {}

  async create(createPropertyDto: CreatePropertyDto) {
    const {
      facilities,
      images,
      documents,
      marketAddress = '',
      tokenAddress = '',
      propertyData,
      ...others
    } = createPropertyDto;
    return await this.prisma.property.create({
      data: {
        marketAddress,
        tokenAddress,
        propertyOwnerAddress: process.env.DEPLOYER_ADDRESS! as Address,
        propertyData: propertyData as unknown as Prisma.JsonObject,
        ...others,
        facilities: {
          create: facilities,
        },
        images: {
          create: images,
        },
        documents: {
          create: documents,
        },
      },
      include: {
        facilities: true,
        images: true,
        documents: true,
      },
    });
  }

  async findAll(request: ListPropertyQueryDto) {
    const { sort, location, propertyType, search, chainId, phase } = request;

    const whereClause: any = { AND: [{ phase: { not: 'draft' } }] };
    whereClause.status = 'visible';
    whereClause.deletedAt = null;

    if (chainId && !isNaN(Number(chainId))) {
      whereClause.chainId = Number(chainId);
    }

    if (location && location !== 'All') {
      whereClause.AND.push({ OR: [{ state: location }, { city: location }] });
    }

    if (propertyType && propertyType !== 'All') {
      whereClause.type = propertyType;
    }

    if (phase && phase !== 'All') {
      whereClause.type = phase;
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
        documents: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.property.findUnique({
      where: { id },
      include: {
        facilities: true,
        images: true,
        documents: true,
      },
    });
  }

  async update(id: string, updatePropertyDto: UpdatePropertyDto) {
    const { facilities, images, documents, ...propertyData } =
      updatePropertyDto;

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
        documents: {
          deleteMany: {},
          create: documents,
        },
      },
      include: {
        facilities: true,
        images: true,
        documents: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.property.delete({
      where: { id },
      include: {
        facilities: true,
        images: true,
        documents: true,
      },
    });
  }

  async setAftermarketPhase(id: string) {
    return this.prisma.property.update({
      where: { id },
      data: {
        isUpcoming: false,
        isAftermarket: true,
        phase: 'aftermarket',
      },
    });
  }

  async setSettlementPhase(id: string) {
    return this.prisma.property.update({
      where: { id },
      data: {
        isUpcoming: false,
        isAftermarket: false,
        phase: 'settlement',
      },
    });
  }

  async generateTokenSymbol() {
    const count =
      (await this.prisma.property.count({ where: { isApproved: true } })) + 1;
    const prefix = 'KLTV';
    const maxLimit = 9999; // KLTV0001 format

    if (count <= maxLimit) {
      return prefix + count.toString().padStart(4, '0');
    }
    return prefix + count.toString();
  }
}

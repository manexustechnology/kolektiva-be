import { Injectable } from '@nestjs/common';
import { CreateUserPropertyDto } from './dto/create-user-property.dto';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { ListUserPropertyQueryDto } from './dto/list-user-property-query.dto';

@Injectable()
export class UserPropertyOwnershipService {
  constructor(private prisma: PrismaService) {}

  async create(createUserPropertyDto: CreateUserPropertyDto) {
    const { walletAddress, propertyId } = createUserPropertyDto;
    let user = await this.prisma.user.findFirst({
      where: { walletAddress },
    });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          walletAddress,
        },
      });
    }
    return this.prisma.userPropertyOwnership.upsert({
      where: {
        walletAddress_propertyId: {
          walletAddress,
          propertyId,
        },
      },
      update: {},
      create: {
        walletAddress,
        propertyId,
      },
    });
  }

  async count(walletAddress: string) {
    return this.prisma.userPropertyOwnership.count({
      where: { walletAddress },
    });
  }

  async findUserProperties(
    walletAddress: string,
    request: ListUserPropertyQueryDto,
  ) {
    const { sort, location, propertyType } = request;

    const whereClause: any = {
      walletAddress,
    };

    const propertyWhereClause: any = {};

    if (location && location !== 'All') {
      propertyWhereClause.OR = [{ state: location }, { city: location }];
    }

    if (propertyType && propertyType !== 'All') {
      propertyWhereClause.type = propertyType;
    }

    let orderPropertyByClause: any = {};

    if (sort === 'Featured') {
      orderPropertyByClause = { isFeatured: 'desc' };
    } else if (sort === 'Newest') {
      orderPropertyByClause = { createdAt: 'desc' };
    } else if (sort === 'Oldest') {
      orderPropertyByClause = { createdAt: 'asc' };
    }

    return this.prisma.userPropertyOwnership.findMany({
      where: {
        ...whereClause,
        property: propertyWhereClause,
      },
      orderBy: Object.keys(orderPropertyByClause).length
        ? { property: orderPropertyByClause }
        : undefined,
      include: {
        property: {
          include: {
            images: {
              take: 1,
            },
          },
        },
      },
    });
  }
}

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

  async findUserProperties(
    walletAddress: string,
    request: ListUserPropertyQueryDto,
  ) {
    const { sort, location, propertyType } = request;

    // Base where clause for user properties
    const whereClause: any = {
      walletAddress,
    };

    // Property-specific where clause
    const propertyWhereClause: any = {};

    if (location && location !== 'All') {
      propertyWhereClause.OR = [{ state: location }, { city: location }];
    }

    if (propertyType && propertyType !== 'All') {
      propertyWhereClause.type = propertyType;
    }

    const orderByClause: any[] = [];

    if (sort === 'Featured') {
      orderByClause.push({ property: { isFeatured: 'desc' } });
    } else if (sort === 'Newest') {
      orderByClause.push({ property: { createdAt: 'desc' } });
    } else if (sort === 'Oldest') {
      orderByClause.push({ property: { createdAt: 'asc' } });
    }

    // Find user properties with related property filtering
    return this.prisma.userPropertyOwnership.findMany({
      where: {
        ...whereClause,
        property: propertyWhereClause,
      },
      orderBy: orderByClause,
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

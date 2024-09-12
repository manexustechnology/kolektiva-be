import { Injectable } from '@nestjs/common';
import { PropertyListingRequest, Prisma } from '@prisma/client';
import { PaginateFunction, paginator, PaginatedResult } from '../../../commons/paginator.commons';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { AdminListPropertyListingRequestQueryDto } from './dto/admin-list-property-listing-request-query.dto';
import { AdminChangePropertyListingRequestStatusBodyDto } from './dto/admin-change-property-listing-request-status-body.dto';

const paginate: PaginateFunction = paginator({ perPage: 10 });

@Injectable()
export class AdminPropertyListingRequestService {
  constructor(private prisma: PrismaService) {}

  async getListPropertyRequest(
    query: AdminListPropertyListingRequestQueryDto,
  ): Promise<PaginatedResult<PropertyListingRequest[]>> {
    const queryList: Prisma.PropertyListingRequestFindManyArgs = {
      where: {
        status: query.status || undefined,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    };

    const propertyListingList: PaginatedResult<PropertyListingRequest[]> =
      await paginate(this.prisma.propertyListingRequest, queryList, {
        page: query.page,
        perPage: query.perPage,
      });

    return propertyListingList;
  }

  async getPropertyRequestDetail(id: string): Promise<PropertyListingRequest> {
    const data = await this.prisma.propertyListingRequest.findFirst({
      where: {
        id,
      },
    });

    return data;
  }

  async changePropertyRequestStatus(
    id: string,
    body: AdminChangePropertyListingRequestStatusBodyDto,
  ): Promise<PropertyListingRequest> {
    const data = await this.prisma.propertyListingRequest.update({
      where: {
        id,
      },
      data: {
        status: body.status,
      },
    });

    return data;
  }
}

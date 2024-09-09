import { Injectable } from '@nestjs/common';
import { SubmitPropertyListingDto } from './dto/submit-property-listing-request.dto';
import { Prisma, PropertyListingRequest } from '@prisma/client';
import { PrismaService } from '../../shared/prisma/prisma.service';
import {
  PaginatedResult,
  PaginateFunction,
  paginator,
} from '../../commons/paginator.commons';
import { ListPropertyListingRequestQueryDto } from './dto/list-property-listing-request-query.dto';
import { changePropertyListingRequestStatusBodyDto } from './dto/change-property-listing-request-status-body.dto';

const paginate: PaginateFunction = paginator({ perPage: 10 });

@Injectable()
export class PropertyListingRequestService {
  constructor(private prisma: PrismaService) {}

  async submitPropertyListingRequest(
    data: SubmitPropertyListingDto,
  ): Promise<PropertyListingRequest> {
    try {
      const newData = await this.prisma.propertyListingRequest.create({
        data: {
          name: data.name,
          phone: data.phone,
          email: data.email,
          address: data.address,
          priceEstimation: data.priceEstimation,
          propertyData: {
            googleMapsLink: data.googleMapsLink,
            landArea: data.landArea,
            buildingArea: data.buildingArea,
            planToSell: data.planToSell,
            propertyType: data.propertyType,
            ownershipStatus: data.ownershipStatus,
            propertyCondition: data.propertyCondition,
            occupancyStatus: data.occupancyStatus,
            propertyManager: data.propertyManager,
            furniture: data.furniture,
            propertyIssues: data.propertyIssues,
            includedFurniture: data.includedFurniture,
          } as Prisma.JsonObject,
        },
      });

      return newData;
    } catch (error) {
      throw new Error('Failed to submit property listing request');
    }
  }

  async getListPropertyRequest(
    query: ListPropertyListingRequestQueryDto,
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
    body: changePropertyListingRequestStatusBodyDto,
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

import { Injectable } from '@nestjs/common';
import { PropertyListingRequest, Prisma } from '@prisma/client';
import {
  PaginateFunction,
  paginator,
  PaginatedResult,
} from '../../../commons/paginator.commons';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { AdminListPropertyListingRequestQueryDto } from './dto/admin-list-property-listing-request-query.dto';
import { AdminChangePropertyListingRequestStatusBodyDto } from './dto/admin-change-property-listing-request-status-body.dto';
import { PropertyService } from '../../property/property.service';
import { PropertyDataJsonDto } from '../../property-listing-request/dto/property-data-json.dto';
import { CreatePropertyImageDto } from '../../property/dto/create-property-body.dto';

import * as dotenv from 'dotenv';
dotenv.config();

const paginate: PaginateFunction = paginator({ perPage: 10 });

@Injectable()
export class AdminPropertyListingRequestService {
  constructor(
    private prisma: PrismaService,
    private property: PropertyService,
  ) {}

  async getListPropertyRequest(
    query: AdminListPropertyListingRequestQueryDto,
  ): Promise<PaginatedResult<PropertyListingRequest[]>> {
    const queryList: Prisma.PropertyListingRequestFindManyArgs = {
      where: {
        status: query.status || undefined,
        address: {
          search: query.search || undefined,
        },
        name: {
          search: query.search || undefined,
        },
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
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const request = await prisma.propertyListingRequest.findUnique({
          where: { id },
        });

        if (!request) {
          throw new Error('Property listing request not found');
        }

        const data = await prisma.propertyListingRequest.update({
          where: {
            id,
          },
          data: {
            status: body.status,
          },
        });

        const propertyData =
          data.propertyData as unknown as PropertyDataJsonDto;
        if (request.status !== 'approved' && body.status === 'approved') {
          await this.property.create({
            address: propertyData?.propertyDetails_propertySummary_address,
            location: propertyData?.propertyDetails_propertySummary_district,
            city: propertyData?.propertyDetails_propertySummary_city,
            state: propertyData?.propertyDetails_propertySummary_state,
            country: propertyData?.propertyDetails_propertySummary_country,
            type: propertyData?.propertyDetails_propertyDetails_propertyType,
            description: propertyData?.propertyDetails_description,
            tokenName: propertyData?.propertyDetails_propertySummary_title,
            totalSupply: propertyData?.financials_token_tokenSupply,
            salePrice: propertyData?.financials_token_tokenPrice,
            createdBy: 'SYSTEM',
            updatedBy: 'SYSTEM',
            chainId: Number(process.env.DEFAULT_CHAIN_ID!),
            facilities: [],
            images: this.imageUrlParser([
              propertyData.propertyDetails_propertyImages_primary,
              ...propertyData.propertyDetails_propertyImages_others,
            ]),
            propertyData: propertyData,
          });
        }

        return data;
      });
    } catch (error) {
      console.error('Change property request status failed:', error);
    }
  }

  private imageUrlParser(urls: string[]): CreatePropertyImageDto[] {
    return urls.map((url, index) => ({
      image: url,
      isHighlight: index === 0,
    }));
  }
}

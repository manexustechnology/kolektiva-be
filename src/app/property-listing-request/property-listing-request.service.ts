import { Injectable } from '@nestjs/common';
import { SubmitPropertyListingDto } from './dto/submit-property-listing-request.dto';
import { Prisma, PropertyListingRequest } from '@prisma/client';
import { PrismaService } from '../../shared/prisma/prisma.service';

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
          propertyData: data.propertyData as unknown as Prisma.JsonObject,
          // googleMapsLink: data.googleMapsLink,
          // landArea: data.landArea,
          // buildingArea: data.buildingArea,
          // planToSell: data.planToSell,
          // propertyType: data.propertyType,
          // ownershipStatus: data.ownershipStatus,
          // propertyCondition: data.propertyCondition,
          // occupancyStatus: data.occupancyStatus,
          // propertyManager: data.propertyManager,
          // furniture: data.furniture,
          // propertyIssues: data.propertyIssues,
          // includedFurniture: data.includedFurniture,
          // } as Prisma.JsonObject,
        },
      });

      return newData;
    } catch (error) {
      throw new Error('Failed to submit property listing request');
    }
  }
}

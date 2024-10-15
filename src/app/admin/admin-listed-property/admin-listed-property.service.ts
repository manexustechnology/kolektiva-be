import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import {
  PaginatedResult,
  PaginateFunction,
  paginator,
} from '../../../commons/paginator.commons';
import { Prisma, Property } from '@prisma/client';
import { AdminListedPropertyListDto } from './dto/admin-listed-property-list.dto';
import {
  AdminChangeListedPropertyPhaseDto,
  AdminChangeListedPropertyStatusDto,
} from './dto/admin-change-listed-property-status.dto';
import { KolektivaContractService } from '../../kolektiva-contract/kolektiva-contract.service';
import { Address } from 'viem';
import {
  CreatePropertyDto,
  CreatePropertyFacilityDto,
  CreatePropertyImageDto,
} from '../../property/dto/create-property-body.dto';
import { PropertyDataDto } from '../../property-listing-request/dto/property-data.dto';
import { PropertyService } from '../../property/property.service';
import { KolektivaCreatePropertyDto } from '../../kolektiva-contract/dto/kolektiva-create-property-dto';
import { UpdatePropertyDto } from '../../property/dto/update-property-body.dto';

const paginate: PaginateFunction = paginator({ perPage: 10 });
const emptyAddr: Address = '0x0000000000000000000000000000000000000000';

@Injectable()
export class AdminListedPropertyService {
  constructor(
    private prisma: PrismaService,
    private property: PropertyService,
    private kolektivaContract: KolektivaContractService,
  ) {}

  async getListedPropertyList(
    query: AdminListedPropertyListDto,
  ): Promise<PaginatedResult<Property[]>> {
    let searchAddress: string | undefined = undefined;

    if (query.searchAddress) {
      searchAddress = query.searchAddress.replace(' ', ' | ');
    }
    const queryList: Prisma.PropertyFindManyArgs = {
      where: {
        status: query.status || undefined,
        address: {
          search: searchAddress,
        },
        deletedAt: null,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    };

    const listedPropertyList: PaginatedResult<Property[]> = await paginate(
      this.prisma.property,
      queryList,
      {
        page: query.page,
        perPage: query.perPage,
      },
    );

    return listedPropertyList;
  }

  async getListedPropertyDetail(id: string): Promise<Property> {
    const data = await this.prisma.property.findFirst({
      where: {
        id,
      },
    });

    return data;
  }

  async removeListedProperty(id: string): Promise<Property> {
    return await this.prisma.property.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async createOrUpdatePropertyTokens(
    propertyData: KolektivaCreatePropertyDto,
  ): Promise<{ tokenAddress: Address; marketAddress: Address }> {
    let tokenAddr = await this.kolektivaContract.getTokenAddress({
      chainId: propertyData.chainId,
      name: propertyData.tokenName,
    });
    let marketAddr = await this.kolektivaContract.getMarketAddress({
      chainId: propertyData.chainId,
      name: propertyData.tokenName,
    });

    const isEmptyAddress = (address: string) =>
      !address || address === emptyAddr;
    if (isEmptyAddress(tokenAddr) || isEmptyAddress(marketAddr)) {
      const { logs } = await this.kolektivaContract.createProperty({
        ...propertyData,
        propertyOwnerAddress: process.env.DEPLOYER_ADDRESS! as Address,
      });

      tokenAddr = logs[0].args.tokenAddress;
      marketAddr = logs[0].args.marketAddress;
    }

    return { tokenAddress: tokenAddr, marketAddress: marketAddr };
  }

  async changePropertyPhase(
    id: string,
    body: AdminChangeListedPropertyPhaseDto,
  ): Promise<any> {
    try {
      const propertyData = await this.getListedPropertyDetail(id);
      let updateData: any = {
        phase: body.phase,
        ...this.determineMarketPhase(body.phase),
      };

      if (!propertyData) {
        throw new Error('Property not found');
      }

      if (
        !propertyData.marketAddress &&
        !propertyData.tokenAddress &&
        propertyData.phase !== 'initial-offering' &&
        body.phase === 'initial-offering'
      ) {
        const { tokenAddress, marketAddress } =
          await this.createOrUpdatePropertyTokens(
            this.transformToKolektivaCreatePropertyDto(propertyData),
          );
        updateData = {
          ...updateData,
          tokenAddress,
          marketAddress,
        };
      }

      return await this.prisma.property.update({
        where: { id },
        data: { ...updateData },
      });
    } catch (error) {
      console.error('Change property status failed:', error);
      throw error;
    }
  }

  async changePropertyStatus(
    id: string,
    body: AdminChangeListedPropertyStatusDto,
  ): Promise<any> {
    try {
      return await this.prisma.property.update({
        where: { id },
        data: { status: body.status },
      });
    } catch (error) {
      console.error('Change property status failed:', error);
      throw error;
    }
  }

  async approveMarket(id: string) {
    const propertyData = await this.getListedPropertyDetail(id);
    if (
      !propertyData ||
      propertyData.isApproved === true ||
      !propertyData.tokenAddress ||
      !propertyData.marketAddress ||
      propertyData.phase !== 'initial-offering'
    ) {
      return;
    }
    await this.kolektivaContract.approveMarket({
      chainId: propertyData.chainId,
      name: propertyData.tokenName,
    });
    await this.prisma.property.update({
      where: { id },
      data: { isApproved: true },
    });
  }

  async createListedProperty(propertyData: PropertyDataDto): Promise<Property> {
    const tokenSymbol = await this.property.generateTokenSymbol();
    const propertyDto = this.mapToCreatePropertyDto(propertyData, {
      tokenSymbol,
      propertyData,
    }) as CreatePropertyDto;

    if (propertyDto.phase === 'initial-offering') {
      const { marketAddress, tokenAddress } =
        await this.createOrUpdatePropertyTokens(
          this.transformToKolektivaCreatePropertyDto(propertyDto),
        );
      propertyDto.marketAddress = marketAddress;
      propertyDto.tokenAddress = tokenAddress;
    }

    const createdProperty = await this.property.create(propertyDto);

    if (propertyDto.phase === 'initial-offering') {
      await this.approveMarket(createdProperty.id);
    }
    return createdProperty;
  }

  async updateListedProperty(
    id: string,
    propertyData: PropertyDataDto,
  ): Promise<Property> {
    const propertyDto = this.mapToCreatePropertyDto(propertyData, {
      propertyData,
    }) as UpdatePropertyDto;

    if (
      !propertyDto.marketAddress &&
      !propertyDto.tokenAddress &&
      propertyDto.phase === 'initial-offering'
    ) {
      const { marketAddress, tokenAddress } =
        await this.createOrUpdatePropertyTokens(
          this.transformToKolektivaCreatePropertyDto(propertyDto),
        );
      propertyDto.marketAddress = marketAddress;
      propertyDto.tokenAddress = tokenAddress;

      await this.approveMarket(id);
    }

    return await this.property.update(id, propertyDto);
  }

  private mapToCreatePropertyDto(
    propertyData: PropertyDataDto,
    others: any,
  ): CreatePropertyDto | UpdatePropertyDto {
    return {
      address: propertyData.propertyDetails.propertySummary.address,
      location: propertyData.propertyDetails.propertySummary.district,
      city: propertyData.propertyDetails.propertySummary.city,
      state: propertyData.propertyDetails.propertySummary.state,
      country: propertyData.propertyDetails.propertySummary.country,
      status: propertyData.propertyDetails.propertyStatus.status,
      phase: propertyData.propertyDetails.propertyStatus.phase,
      type: propertyData.propertyDetails.propertyDetails.propertyType,
      description: propertyData.propertyDetails.description,
      tokenName: propertyData.propertyDetails.propertySummary.title,
      // tokenSymbol: tokenSymbol,
      totalSupply: propertyData.financials.token.tokenSupply,
      salePrice: propertyData.financials.token.tokenPrice,
      createdBy: 'SYSTEM',
      updatedBy: 'SYSTEM',
      chainId: Number(process.env.DEFAULT_CHAIN_ID),
      facilities: this.facilitiesParser(propertyData), // Assuming no facilities data is provided in propertyData
      images: this.imagesParser(propertyData),
      ...this.determineMarketPhase(
        propertyData.propertyDetails.propertyStatus.phase,
      ),
      ...others,
    };
  }

  private imagesParser(
    propertyData: PropertyDataDto,
  ): CreatePropertyImageDto[] {
    const urls = [
      propertyData.propertyDetails.propertyImages.primary,
      ...propertyData.propertyDetails.propertyImages.others,
    ];
    return urls.map((url, index) => ({
      image: url,
      isHighlight: index === 0,
    }));
  }
  private facilitiesParser(
    propertyData: PropertyDataDto,
  ): CreatePropertyFacilityDto[] {
    const facilities: CreatePropertyFacilityDto[] = [];

    const propertySpecs = propertyData.propertyDetails.propertySpecifications;
    const propertySummary = propertyData.propertyDetails.propertySummary;
    if (propertySummary.landArea) {
      facilities.push({
        type: 'LAND_AREA',
        facility: propertySummary.landArea.toString(),
        isHighlight: true,
      });
    }
    if (propertySummary.buildingArea) {
      facilities.push({
        type: 'BUILDING_AREA',
        facility: propertySummary.buildingArea.toString(),
        isHighlight: true,
      });
    }
    if (propertySpecs.floors) {
      facilities.push({
        type: 'FLOORS',
        facility: propertySpecs.floors.toString(),
        isHighlight: true,
      });
    }
    if (propertySpecs.waterSupply) {
      facilities.push({
        type: 'WATER_SUPPLY',
        facility: propertySpecs.waterSupply,
        isHighlight: true,
      });
    }
    if (propertySpecs.propertyCertificate) {
      facilities.push({
        type: 'CERTIFICATE',
        facility: propertySpecs.propertyCertificate,
        isHighlight: true,
      });
    }
    if (propertySpecs.garage) {
      facilities.push({
        type: 'GARAGE',
        facility: propertySpecs.garage,
        isHighlight: true,
      });
    }
    if (propertySpecs.bedrooms) {
      facilities.push({
        type: 'BEDROOMS',
        facility: propertySpecs.bedrooms.toString(),
        isHighlight: true,
      });
    }
    if (propertySpecs.garden) {
      facilities.push({
        type: 'GARDEN',
        facility: propertySpecs.garden,
        isHighlight: true,
      });
    }
    if (propertySpecs.bathrooms) {
      facilities.push({
        type: 'BATHROOMS',
        facility: propertySpecs.bathrooms.toString(),
        isHighlight: true,
      });
    }
    if (propertySpecs.swimPool) {
      facilities.push({
        type: 'POOL',
        facility: propertySpecs.swimPool,
        isHighlight: true,
      });
    }

    return facilities;
  }

  private transformToKolektivaCreatePropertyDto(
    input: any,
  ): KolektivaCreatePropertyDto {
    return {
      chainId: input.chainId,
      tokenName: input.tokenName,
      tokenSymbol: input.tokenSymbol,
      type: input.type,
      country: input.country,
      state: input.state,
      city: input.city,
      location: input.location,
      totalSupply: input.totalSupply,
      salePrice: input.salePrice,
    };
  }

  private determineMarketPhase(phase: string): {
    isUpcoming: boolean;
    isAftermarket: boolean;
  } {
    let isUpcoming = false;
    let isAftermarket = false;

    switch (phase) {
      case 'upcoming':
        isUpcoming = true;
        break;
      case 'initial-offering':
        isUpcoming = false;
        isAftermarket = false;
        break;
      case 'aftermarket':
        isAftermarket = true;
        break;
    }

    return { isUpcoming, isAftermarket };
  }
}

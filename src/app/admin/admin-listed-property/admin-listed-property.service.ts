import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import {
  PaginatedResult,
  PaginateFunction,
  paginator,
} from '../../../commons/paginator.commons';
import { Prisma, Property } from '@prisma/client';
import { AdminListedPropertyListDto } from './dto/admin-listed-property-list.dto';
import { AdminChangeListedPropertyStatusDto } from './dto/admin-change-listed-property-status.dto';
import { KolektivaContractService } from '../../kolektiva-contract/kolektiva-contract.service';
import { Address } from 'viem';

const paginate: PaginateFunction = paginator({ perPage: 10 });

@Injectable()
export class AdminListedPropertyService {
  constructor(
    private prisma: PrismaService,
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
  async changePropertyStatus(
    id: string,
    body: AdminChangeListedPropertyStatusDto,
  ): Promise<any> {
    try {
      const propertyData = await this.getListedPropertyDetail(id);
      let updateData = { status: body.status };

      if (!propertyData) {
        throw new Error('Property not found');
      }

      if (
        !propertyData.marketAddress &&
        !propertyData.tokenAddress &&
        propertyData.status !== 'initialOffering' &&
        body.status === 'initialOffering'
      ) {
        let tokenAddr = await this.kolektivaContract.getTokenAddress({
          chainId: propertyData.chainId,
          name: propertyData.tokenName,
        });
        let marketAddr = await this.kolektivaContract.getMarketAddress({
          chainId: propertyData.chainId,
          name: propertyData.tokenName,
        });
        updateData['isUpcoming'] = false;

        if (!tokenAddr || !marketAddr) {
          const { logs } = await this.kolektivaContract.createProperty({
            chainId: propertyData.chainId,
            name: propertyData.tokenName,
            symbol: propertyData.tokenSymbol,
            propertyType: propertyData.type,
            country: propertyData.country,
            state: propertyData.state,
            city: propertyData.city,
            location: propertyData.location,
            totalSupply: propertyData.totalSupply,
            salePrice: propertyData.salePrice,
            propertyOwnerAddress: process.env.DEPLOYER_ADDRESS! as Address,
          });

          tokenAddr = logs[0].args.tokenAddress;
          marketAddr = logs[0].args.marketAddress;
          updateData['marketAddress'] = marketAddr;
          updateData['tokenAddress'] = tokenAddr;
        } else {
          updateData['marketAddress'] = marketAddr;
          updateData['tokenAddress'] = tokenAddr;
        }
      }

      return await this.prisma.property.update({
        where: { id },
        data: { ...updateData },
      });
    } catch (error) {
      console.error('Change property status failed:', error);
      throw error; // Rethrow the error to ensure that the caller is aware that the operation failed
    }
  }

  async approveMarket(id: string) {
    const propertyData = await this.getListedPropertyDetail(id);
    if (
      (!propertyData ||
        !propertyData.tokenAddress ||
        !propertyData.marketAddress) &&
      propertyData.status === 'initialOffering'
    ) {
      throw new Error(`Property id ${id} not valid to approve market`);
    }

    // Approve the market allowance onchain
    return await this.kolektivaContract.approveMarket({
      chainId: propertyData.chainId,
      name: propertyData.tokenName,
    });
  }
}

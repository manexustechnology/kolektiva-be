import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import {
  PaginatedResult,
  PaginateFunction,
  paginator,
} from '../../../commons/paginator.commons';
import { Prisma, Property } from '@prisma/client';
import { AdminListedPropertyListDto } from './dto/admin-listed-property-list.dto';

const paginate: PaginateFunction = paginator({ perPage: 10 });

@Injectable()
export class AdminListedPropertyService {
  constructor(private prisma: PrismaService) {}

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
}

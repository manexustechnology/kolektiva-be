import { Injectable } from '@nestjs/common';
import { CreateUserActivityDto } from './dto/create-user-activity.dto';
import { UpdateUserActivityDto } from './dto/update-user-activity.dto';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { User, UserActivity } from '@prisma/client';
import { ListUserActivityDto } from './dto/list-user-activity.dto';
import {
  PaginatedResult,
  PaginateFunction,
  paginator,
} from '../../commons/paginator.commons';

const paginate: PaginateFunction = paginator({ perPage: 10 });

@Injectable()
export class UserActivityService {
  constructor(private prisma: PrismaService) {}

  async create(createUserActivityDto: CreateUserActivityDto, user: User) {
    const amount = createUserActivityDto.amount
      ? BigInt(createUserActivityDto.amount)
      : null;
    const price = createUserActivityDto.price
      ? BigInt(createUserActivityDto.price)
      : null;

    return await this.prisma.userActivity.create({
      data: {
        propertyId: createUserActivityDto.propertyId,
        activity: createUserActivityDto.activity,
        activityType: createUserActivityDto.activityType,
        txHash: createUserActivityDto.txHash,
        amount: amount,
        price: price,
        userId: user.id,
      },
    });
  }

  async findAll(query: ListUserActivityDto) {
    const {
      page,
      perPage,
      userId,
      propertyId,
      activityType,
      sort,
      activity,
      dateRange,
    } = query;

    const whereClause: any = { AND: [] };

    if (userId) {
      whereClause.AND.push({ userId });
    }

    if (propertyId) {
      whereClause.AND.push({ propertyId });
    }

    if (activityType) {
      whereClause.AND.push({ activityType });
    }

    if (activity) {
      whereClause.AND.push({ activity });
    }

    if (dateRange && dateRange.length === 2) {
      const [minDate, maxDate] = dateRange;
      if (minDate) {
        whereClause.AND.push({ createdAt: { gte: minDate } });
      }
      if (maxDate) {
        whereClause.AND.push({ createdAt: { lte: maxDate } });
      }
    }

    const orderByClause: any[] = [];
    if (sort === 'Newest') {
      orderByClause.push({ createdAt: 'desc' });
    } else if (sort === 'Oldest') {
      orderByClause.push({ createdAt: 'asc' });
    }

    const paginatedResult: PaginatedResult<UserActivity[]> = await paginate(
      this.prisma.userActivity,
      {
        where: whereClause,
        orderBy: orderByClause,
      },
      {
        page: page || 1,
        perPage: perPage || 10,
      },
    );

    return paginatedResult;
  }

  async update(id: string, updateUserActivityDto: UpdateUserActivityDto) {
    const amount = updateUserActivityDto.amount
      ? BigInt(updateUserActivityDto.amount)
      : null;
    const price = updateUserActivityDto.price
      ? BigInt(updateUserActivityDto.price)
      : null;

    return await this.prisma.userActivity.update({
      where: { id },
      data: {
        ...updateUserActivityDto,
        amount: amount,
        price: price,
      },
    });
  }

  async remove(id: string) {
    return await this.prisma.userActivity.delete({
      where: { id },
    });
  }
}

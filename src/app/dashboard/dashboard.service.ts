import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import {
  DashboardQueryDto,
  DashboardLatestTrendDto,
} from './dto/dashboard-query.dto';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getTotalUsers(query: DashboardQueryDto): Promise<number> {
    return this.prisma.user.count({
      where: this.buildDateRangeFilter('createdAt', query.dateRange),
    });
  }

  private getDefaultSinceDate(): Date {
    const defaultSince = new Date();
    defaultSince.setMonth(defaultSince.getMonth() - 1);
    return defaultSince;
  }

  async getUserCounts(query: DashboardQueryDto) {
    const newUsers = await this.prisma.user.count({
      where: this.buildDateRangeFilter('createdAt', query.dateRange),
    });

    const activeUsers = await this.prisma.user.count({
      where: this.buildDateRangeFilter('lastActive', query.dateRange),
    });

    const userBoughtProperties = await this.getUserBoughtPropertyCounts(query);

    return {
      newUsers,
      activeUsers,
      userBoughtProperties,
    };
  }

  async getPropertyCounts(query: DashboardQueryDto) {
    const whereClause = this.buildDateRangeFilter('createdAt', query.dateRange);

    const upcomingProperties = await this.prisma.property.count({
      where: { ...whereClause, phase: 'upcoming', deletedAt: null },
    });

    const initialOfferingProperties = await this.prisma.property.count({
      where: { ...whereClause, phase: 'initial-offering', deletedAt: null },
    });

    const aftermarketProperties = await this.prisma.property.count({
      where: { ...whereClause, phase: 'aftermarket', deletedAt: null },
    });

    return {
      upcomingProperties,
      initialOfferingProperties,
      aftermarketProperties,
    };
  }

  private async getUserBoughtPropertyCounts(query: DashboardQueryDto) {
    const userBoughtPropertyUserCounts = await this.prisma.$queryRaw<
      { count: number }[]
    >`
      SELECT 
        COUNT(DISTINCT ua."userId") as count
      FROM "user_activities" ua
      INNER JOIN "properties" p ON ua."propertyId" = p."id"
      WHERE p."deletedAt" IS NULL AND ua."activityType" = 'buy'
      ${this.buildDateRangeSQL('ua."createdAt"', query.dateRange)};
    `;

    return userBoughtPropertyUserCounts.length > 0
      ? userBoughtPropertyUserCounts[0].count
      : 0;
  }

  async getUserActivities(query: DashboardQueryDto) {
    const propertyRequests = await this.prisma.$queryRaw<
      { date: Date; count: number }[]
    >`
      SELECT 
        DATE_TRUNC('day', ua."createdAt") as date,
        COUNT(ua."propertyId") as count
      FROM "user_activities" ua
      INNER JOIN "properties" p ON ua."propertyId" = p."id"
      WHERE p."deletedAt" IS NULL
      ${this.buildDateRangeSQL('ua."createdAt"', query.dateRange)}
      GROUP BY date
      ORDER BY date ASC;
    `;

    return this.formatPropertyRequests(propertyRequests);
  }

  async getPropertyListingRequests(query: DashboardQueryDto) {
    const listingRequests = await this.prisma.$queryRaw<
      { date: Date; count: number }[]
    >`
      SELECT 
        DATE_TRUNC('day', plr."createdAt") as date,
        COUNT(plr."id") as count
      FROM "property_listing_requests" plr
      WHERE plr."deletedAt" IS NULL
      ${this.buildDateRangeSQL('plr."createdAt"', query.dateRange)}
      GROUP BY date
      ORDER BY date ASC;
    `;

    return this.formatPropertyRequests(listingRequests);
  }

  private formatPropertyRequests(requests: { date: Date; count: number }[]) {
    return requests.map((request) => ({
      date: request.date.toISOString().split('T')[0],
      count: request.count,
    }));
  }

  async getLatestTrades(query: DashboardLatestTrendDto) {
    return await this.prisma.userActivity.findMany({
      where: {
        activity: query.activity,
        ...this.buildDateRangeFilter('createdAt', query.dateRange),
      },
      orderBy: { createdAt: 'desc' },
      take: query.limit,
      include: {
        property: true,
      },
    });
  }

  private buildDateRangeFilter(
    field: string,
    dateRange?: [Date | null, Date | null],
  ) {
    if (!dateRange || (dateRange[0] === null && dateRange[1] === null))
      return {};
    const [startDate, endDate] = dateRange;
    return {
      [field]: {
        ...(startDate !== null ? { gte: startDate } : {}),
        ...(endDate !== null ? { lte: endDate } : {}),
      },
    };
  }

  private buildDateRangeSQL(
    field: string,
    dateRange?: [Date | null, Date | null],
  ) {
    if (!dateRange || (dateRange[0] === null && dateRange[1] === null))
      return '';
    const [startDate, endDate] = dateRange;
    const conditions = [];
    if (startDate !== null) {
      conditions.push(`${field} >= '${startDate.toISOString()}'`);
    }
    if (endDate !== null) {
      conditions.push(`${field} <= '${endDate.toISOString()}'`);
    }
    return conditions.length > 0 ? `AND ${conditions.join(' AND ')}` : '';
  }
}

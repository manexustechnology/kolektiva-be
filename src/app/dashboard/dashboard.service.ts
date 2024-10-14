import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getTotalUsers(): Promise<number> {
    return this.prisma.user.count();
  }

  async getNewUsers(since: Date): Promise<number> {
    return this.prisma.user.count({
      where: {
        createdAt: {
          gte: since,
        },
      },
    });
  }

  async getActiveUsers(since: Date): Promise<number> {
    return this.prisma.user.count({
      where: {
        lastActive: {
          gte: since,
        },
      },
    });
  }
}

import {
  Controller,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AdminGuard } from '../../guards/admin.guard';

@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @HttpCode(HttpStatus.OK)
  @Get('total-users')
  getTotalUsers() {
    return this.dashboardService.getTotalUsers();
  }

  @HttpCode(HttpStatus.OK)
  @Get('new-users')
  getNewUsers(@Query('since') since?: Date) {
    return this.dashboardService.getNewUsers(since);
  }

  @HttpCode(HttpStatus.OK)
  @Get('active-users')
  getActiveUsers(@Query('since') since?: Date) {
    return this.dashboardService.getActiveUsers(since);
  }
}

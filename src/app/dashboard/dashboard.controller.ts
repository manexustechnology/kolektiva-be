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
import {
  DashboardLatestTrendDto,
  DashboardQueryDto,
} from './dto/dashboard-query.dto';

// @ApiBearerAuth()
// @UseGuards(AdminGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @HttpCode(HttpStatus.OK)
  @Get('total-users')
  getTotalUsers(@Query() query: DashboardQueryDto) {
    return this.dashboardService.getTotalUsers(query);
  }

  @HttpCode(HttpStatus.OK)
  @Get('new-users')
  getUserCounts(@Query() query: DashboardQueryDto) {
    console.log(query.dateRange);
    return this.dashboardService.getUserCounts(query);
  }

  @HttpCode(HttpStatus.OK)
  @Get('property-counts')
  getPropertyCounts(@Query() query: DashboardQueryDto) {
    return this.dashboardService.getPropertyCounts(query);
  }

  @HttpCode(HttpStatus.OK)
  @Get('user-activities')
  getUserActivities(@Query() query: DashboardQueryDto) {
    return this.dashboardService.getUserActivities(query);
  }

  @HttpCode(HttpStatus.OK)
  @Get('property-requests')
  getPropertyListingRequests(@Query() query: DashboardQueryDto) {
    return this.dashboardService.getPropertyListingRequests(query);
  }

  @HttpCode(HttpStatus.OK)
  @Get('latest-trades')
  getLatestTrades(@Query() query: DashboardLatestTrendDto) {
    return this.dashboardService.getLatestTrades(query);
  }
}

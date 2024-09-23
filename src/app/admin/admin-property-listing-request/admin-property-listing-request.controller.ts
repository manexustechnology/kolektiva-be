import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdminPropertyListingRequestService } from './admin-property-listing-request.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from '../../../decorators/response/response.decorator';
import { AdminGuard } from '../../../guards/admin.guard';
import { AdminListPropertyListingRequestQueryDto } from './dto/admin-list-property-listing-request-query.dto';
import { AdminChangePropertyListingRequestStatusBodyDto } from './dto/admin-change-property-listing-request-status-body.dto';
import { TransformInterceptor } from '../../../interceptors/transform/transform.interceptor';

@ApiTags('Property Listing Request (Admin)')
@UseInterceptors(TransformInterceptor)
@Controller('admin/property-listing-request')
export class AdminPropertyListingRequestController {
  constructor(
    private readonly adminPropertyListingRequestService: AdminPropertyListingRequestService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Data retrieved successfully!',
  })
  @ResponseMessage('Data retrieved successfully!')
  @Get()
  async getListPropertyRequest(
    @Query() query: AdminListPropertyListingRequestQueryDto,
  ) {
    return await this.adminPropertyListingRequestService.getListPropertyRequest(
      query,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Data retrieved successfully!',
  })
  @ResponseMessage('Data retrieved successfully!')
  @Get('detail/:id')
  async getPropertyRequestDetail(@Param('id') id: string) {
    return await this.adminPropertyListingRequestService.getPropertyRequestDetail(
      id,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Status successfully updated!',
  })
  @ResponseMessage('Status successfully updated!')
  @Post('change-status/:id')
  async changePropertyRequestStatus(
    @Param('id') id: string,
    @Body() body: AdminChangePropertyListingRequestStatusBodyDto,
  ) {
    return await this.adminPropertyListingRequestService.changePropertyRequestStatus(
      id,
      body,
    );
  }
}

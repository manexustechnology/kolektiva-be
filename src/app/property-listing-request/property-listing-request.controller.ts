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
import { PropertyListingRequestService } from './property-listing-request.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from '../../decorators/response/response.decorator';
import { SubmitPropertyListingDto } from './dto/submit-property-listing-request.dto';
import { ListPropertyListingRequestQueryDto } from './dto/list-property-listing-request-query.dto';
import { TransformInterceptor } from '../../interceptors/transform/transform.interceptor';
import { changePropertyListingRequestStatusBodyDto } from './dto/change-property-listing-request-status-body.dto';
import { AdminGuard } from '../../guards/admin.guard';

@ApiTags('Property Listing Request')
@UseInterceptors(TransformInterceptor)
@Controller('property-listing-request')
export class PropertyListingRequestController {
  constructor(
    private readonly propertyListingRequestService: PropertyListingRequestService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Form submitted successfully!',
  })
  @ResponseMessage('Form submitted successfully!')
  @Post('submit')
  async submitPropertyListingRequest(@Body() data: SubmitPropertyListingDto) {
    return await this.propertyListingRequestService.submitPropertyListingRequest(
      data,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Data retrieved successfully!',
  })
  @ResponseMessage('Data retrieved successfully!')
  @Get()
  async getListPropertyRequest(
    @Query() query: ListPropertyListingRequestQueryDto,
  ) {
    return await this.propertyListingRequestService.getListPropertyRequest(
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
    return await this.propertyListingRequestService.getPropertyRequestDetail(
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
    @Body() body: changePropertyListingRequestStatusBodyDto,
  ) {
    return await this.propertyListingRequestService.changePropertyRequestStatus(
      id,
      body,
    );
  }
}

import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { PropertyListingRequestService } from './property-listing-request.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from '../../decorators/response/response.decorator';
import { SubmitPropertyListingDto } from './dto/submit-property-listing-request.dto';
import { TransformInterceptor } from '../../interceptors/transform/transform.interceptor';

@ApiTags('Property Listing Request (User)')
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

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Form submitted successfully!',
  })
  @ResponseMessage('Form submitted successfully!')
  @Put('/:id')
  async updatePropertyListingRequest(
    @Param('id') id: string,
    @Body() data: SubmitPropertyListingDto,
  ) {
    return await this.propertyListingRequestService.updatePropertyListingRequest(
      id,
      data,
    );
  }
}

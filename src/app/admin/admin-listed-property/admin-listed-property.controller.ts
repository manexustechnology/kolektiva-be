import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdminListedPropertyService } from './admin-listed-property.service';
import { AdminListedPropertyListDto } from './dto/admin-listed-property-list.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseMessage } from '../../../decorators/response/response.decorator';
import { TransformInterceptor } from '../../../interceptors/transform/transform.interceptor';
import { AdminGuard } from '../../../guards/admin.guard';
import {
  AdminChangeListedPropertyPhaseDto,
  AdminChangeListedPropertyStatusDto,
} from './dto/admin-change-listed-property-status.dto';
import { PropertyDataDto } from '../../property-listing-request/dto/property-data.dto';
import { Property } from '@prisma/client';

@ApiTags('Listed Property (Admin)')
@UseInterceptors(TransformInterceptor)
@Controller('admin/listed-property')
export class AdminListedPropertyController {
  constructor(
    private readonly adminListedPropertyService: AdminListedPropertyService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Data retrieved successfully!',
  })
  @ResponseMessage('Data retrieved successfully!')
  @Get()
  async list(@Query() query: AdminListedPropertyListDto) {
    return await this.adminListedPropertyService.getListedPropertyList(query);
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
    return await this.adminListedPropertyService.getListedPropertyDetail(id);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Status successfully updated!',
  })
  @ResponseMessage('Status successfully updated!')
  @Patch('change-status/:id')
  async changePropertyRequestStatus(
    @Param('id') id: string,
    @Body() body: AdminChangeListedPropertyStatusDto,
  ) {
    const result = await this.adminListedPropertyService.changePropertyStatus(
      id,
      body,
    );
    return result;
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Status successfully updated!',
  })
  @ResponseMessage('Status successfully updated!')
  @Patch('change-phase/:id')
  async changePropertyRequestPhase(
    @Param('id') id: string,
    @Body() body: AdminChangeListedPropertyPhaseDto,
  ) {
    const result = await this.adminListedPropertyService.changePropertyPhase(
      id,
      body,
    );
    await this.adminListedPropertyService.approveMarket(id);
    return result;
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Property successfully created!',
  })
  @ResponseMessage('Property successfully created!')
  @Post('submit')
  async submitListedProperty(
    @Body() propertyData: PropertyDataDto,
  ): Promise<Property> {
    return await this.adminListedPropertyService.createListedProperty(
      propertyData,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Property successfully updated!',
  })
  @ResponseMessage('Property successfully updated!')
  @Put('update/:id')
  async updateListedProperty(
    @Param('id') id: string,
    @Body() propertyData: PropertyDataDto,
  ): Promise<Property> {
    return await this.adminListedPropertyService.updateListedProperty(
      id,
      propertyData,
    );
  }
}

import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdminListedPropertyService } from './admin-listed-property.service';
import { AdminListedPropertyListDto } from './dto/admin-listed-property-list.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from '../../../decorators/response/response.decorator';
import { TransformInterceptor } from '../../../interceptors/transform/transform.interceptor';
import { AdminGuard } from '../../../guards/admin.guard';

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
}

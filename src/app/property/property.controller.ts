import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property-body.dto';
import { UpdatePropertyDto } from './dto/update-property-body.dto';
import { PropertyService } from './property.service';
import { ResponseMessage } from '../../decorators/response/response.decorator';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ListPropertyQueryDto } from './dto/list-property-query.dto';

@ApiTags('Property')
@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Successfully created new property!',
  })
  @ResponseMessage('Successfully created new property!')
  @Post()
  create(@Body() createPropertyDto: CreatePropertyDto) {
    return this.propertyService.create(createPropertyDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Successfully get property data!',
  })
  @ResponseMessage('Successfully get property data!')
  @Get()
  findAll(@Query() request: ListPropertyQueryDto) {
    return this.propertyService.findAll(request);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Successfully get property data!',
  })
  @ResponseMessage('Successfully get property data!')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertyService.findOne(id);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Successfully updated property!',
  })
  @ResponseMessage('Successfully updated property!')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    return this.propertyService.update(id, updatePropertyDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Successfully deleted property!',
  })
  @ResponseMessage('Successfully deleted property!')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertyService.remove(id);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Successfully set property to aftermarket phase!',
  })
  @ResponseMessage('Successfully set property to aftermarket phase!')
  @Patch('set-aftermarket/:id')
  async setAftermarket(@Param('id') id: string) {
    return this.propertyService.setAftermarketPhase(id);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Successfully set property to settlement phase!',
  })
  @ResponseMessage('Successfully set property to settlement phase!')
  @Patch('set-settlement/:id')
  async setSettlement(@Param('id') id: string) {
    return this.propertyService.setSettlementPhase(id);
  }
}

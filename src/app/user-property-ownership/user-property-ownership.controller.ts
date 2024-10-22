import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { UserPropertyOwnershipService } from './user-property-ownership.service';
import { CreateUserPropertyDto } from './dto/create-user-property.dto';
import { ListUserPropertyQueryDto } from './dto/list-user-property-query.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from '../../decorators/response/response.decorator';
import { TransformInterceptor } from '../../interceptors/transform/transform.interceptor';

@ApiTags('User Property Ownership')
@Controller('user-property')
export class UserPropertyOwnershipController {
  constructor(
    private readonly userPropertyOwnershipService: UserPropertyOwnershipService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Successfully created new user property!',
  })
  @ResponseMessage('Successfully created new user property!')
  @Post()
  async create(@Body() createUserPropertyDto: CreateUserPropertyDto) {
    return this.userPropertyOwnershipService.create(createUserPropertyDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Successfully get user property data!',
  })
  @ResponseMessage('Successfully get user property data!')
  @Get(':walletAddress')
  async findUserProperties(
    @Param('walletAddress') walletAddress: string,
    @Query() request: ListUserPropertyQueryDto,
  ) {
    return this.userPropertyOwnershipService.findUserProperties(
      walletAddress,
      request,
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Successfully get count user property data!',
  })
  @ResponseMessage('Successfully get count user property data!')
  @Get('count/:walletAddress')
  async getCountUserProperties(@Param('walletAddress') walletAddress: string) {
    return this.userPropertyOwnershipService.count(walletAddress);
  }
}

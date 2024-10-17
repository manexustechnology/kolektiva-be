import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserActivityDto } from './dto/create-user-activity.dto';
import { UpdateUserActivityDto } from './dto/update-user-activity.dto';
import { RequestWithUser, VerifyGuard } from '../../guards/verify.guard';
import { AdminGuard } from '../../guards/admin.guard';
import { ListUserActivityDto } from './dto/list-user-activity.dto';
import { UserActivityService } from './user-activity.service';
import { TransformInterceptor } from '../../interceptors/transform/transform.interceptor';

@ApiTags('User Activities')
@UseInterceptors(TransformInterceptor)
@Controller('user-activities')
export class UserActivityController {
  constructor(private readonly userActivityService: UserActivityService) {}

  @ApiBearerAuth()
  @UseGuards(VerifyGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'User activity successfully created!' })
  @Post('create')
  createUserActivity(
    @Body() createUserActivityDto: CreateUserActivityDto,
    @Req() request: RequestWithUser,
  ) {
    return this.userActivityService.create(createUserActivityDto, request.user);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'User activities successfully retrieved!' })
  @Get('list')
  listUserActivities(@Query() query: ListUserActivityDto) {
    return this.userActivityService.findAll(query);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'User activity successfully updated!' })
  @Patch('update/:id')
  updateUserActivity(
    @Param('id') id: string,
    @Body() updateUserActivityDto: UpdateUserActivityDto,
  ) {
    return this.userActivityService.update(id, updateUserActivityDto);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'User activity successfully removed!' })
  @Delete('remove/:id')
  removeUserActivity(@Param('id') id: string) {
    return this.userActivityService.remove(id);
  }
}

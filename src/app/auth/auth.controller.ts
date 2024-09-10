import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TransformInterceptor } from '../../interceptors/transform/transform.interceptor';
import { AuthService } from './auth.service';
import { ResponseMessage } from '../../decorators/response/response.decorator';
import { InviteCodeBodyDto } from './dto/invite-code-body.dto';
import { RequestWithUser, VerifyGuard } from '../../guards/verify.guard';
import { StoreOnBoardingStepBodyDto } from './dto/onboarding-step-body.dto';

@ApiTags('Auth')
@UseInterceptors(TransformInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBearerAuth()
  @UseGuards(VerifyGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Data is valid!',
  })
  @ResponseMessage('Data is valid!')
  @Post('invite-code')
  async applyInviteCode(
    @Body() data: InviteCodeBodyDto,
    @Req() request: RequestWithUser,
  ) {
    return await this.authService.applyInviteCode(data, request.user);
  }

  @ApiBearerAuth()
  @UseGuards(VerifyGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Successfully verify data!',
  })
  @ResponseMessage('Successfully verify data!')
  @Post('finish-onboarding')
  async finishOnboarding(@Req() request: RequestWithUser) {
    return await this.authService.finishOnboarding(request.user);
  }

  @ApiBearerAuth()
  @UseGuards(VerifyGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Successfully get on boarding step data!',
  })
  @ResponseMessage('Successfully get on boarding step data!')
  @Post('store/onboarding-step')
  async storeOnboardingStep(@Body() data: StoreOnBoardingStepBodyDto) {
    return await this.authService.storeOnboardingStep(data);
  }

  @ApiBearerAuth()
  @UseGuards(VerifyGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Successfully get user data!',
  })
  @ResponseMessage('Successfully get user data!')
  @Get('me')
  async me(@Req() request: RequestWithUser) {
    return await this.authService.me(request.user);
  }

  @ApiBearerAuth()
  @UseGuards(VerifyGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Successfully verify data!',
  })
  @ResponseMessage('Successfully verify data!')
  @Post('update/zkme-verification')
  async setUserZkmeVerification(@Req() request: RequestWithUser) {
    return await this.authService.setUserZkmeVerification(request.user);
  }
}

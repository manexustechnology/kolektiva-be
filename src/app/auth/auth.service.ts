import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { ConfigService } from '../../shared/config/config.service';
import { User } from '@prisma/client';
import { VerifyUserFailedException } from '../../exceptions/verify-user-failed.exception';
import {
  ERROR_VERIFY_USER_REFERRAL_CODE_NOT_FOUND,
  ERROR_VERIFY_USER_REFERRAL_REACH_MAXIMUM,
  ERROR_VERIFY_USER_TWITTER_INVALID,
} from '../../constants/error-code.constants';
import { createRandomString } from '../../commons/string.common';
import { InviteCodeBodyDto } from './dto/invite-code-body.dto';
import { StoreOnBoardingStepBodyDto } from './dto/onboarding-step-body.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async applyInviteCode(data: InviteCodeBodyDto, user: User): Promise<User> {
    // validate invite code
    const validateRefUser = await this.validateReferral(data.inviteCode);
    const refUser = validateRefUser;

    // assign user referral
    await this.prisma.referral.create({
      data: {
        referralUserId: refUser.id,
        invitedUserId: user.id,
      },
    });

    // add invite code to user
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        inviteCode: data.inviteCode,
      },
    });

    // give point to referral user
    await this.prisma.user.update({
      where: {
        id: refUser.id,
      },
      data: {
        point: refUser.point + BigInt(this.config.point.referralJoined),
      },
    });

    return user;
  }

  async finishOnboarding(user: User): Promise<User> {
    if (!user.finishOnboarding) {
      // if (!user.twitterId) {
      //   throw new VerifyUserFailedException(
      //     'Twitter not connected',
      //     ERROR_VERIFY_USER_TWITTER_INVALID,
      //   );
      // }

      // update point and finish onboarding
      const referralCode = await this.generateReferralCode();
      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          finishOnboarding: true,
          referralCode,
          referralCodeLimit: this.config.referrals.maximum,
          // give point for user success onboard
          point: this.config.point.successOnboard,
        },
      });
    }

    return user;
  }

  async me(user: User): Promise<User> {
    return user;
  }

  async storeOnboardingStep(data: StoreOnBoardingStepBodyDto): Promise<bigint> {
    const walletUser = await this.prisma.user.findFirst({
      where: {
        walletAddress: data.walletAddress,
      },
    });

    if (!walletUser) {
      return BigInt(0);
    }

    await this.prisma.user.update({
      where: {
        id: walletUser.id,
      },
      data: {
        onboardingStep: data.step,
      },
    });

    return BigInt(data.step);
  }

  async validateReferral(code: string): Promise<User> {
    // Check if referral code exists
    const user = await this.prisma.user.findFirst({
      where: {
        referralCode: code.toLowerCase(),
      },
    });
    if (!user) {
      throw new VerifyUserFailedException(
        'Referral code not found!',
        ERROR_VERIFY_USER_REFERRAL_CODE_NOT_FOUND,
      );
    }

    // Check referral limit
    const totalReferrals = await this.prisma.referral.count({
      where: {
        referralUserId: user.id,
      },
    });
    if (totalReferrals >= user.referralCodeLimit) {
      throw new VerifyUserFailedException(
        'Invitation code reach maximum referrals!',
        ERROR_VERIFY_USER_REFERRAL_REACH_MAXIMUM,
      );
    }

    return user;
  }

  async generateReferralCode(): Promise<string> {
    let code = '';
    let exists = null;

    do {
      code = createRandomString(6);
      exists = await this.prisma.user.findFirst({
        where: {
          referralCode: code,
        },
      });
    } while (exists);

    return code;
  }

  async setUserZkmeVerification(user: User): Promise<User> {
    if (!user.zkmeVerification) {
      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          zkmeVerification: true
        },
      });
    }

    return user;
  }
}

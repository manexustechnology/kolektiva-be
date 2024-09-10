import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from '../constants/auth.constants';
import { PrismaService } from '../shared/prisma/prisma.service';
import { User } from '@prisma/client';
import { VerifyUserFailedException } from '../exceptions/verify-user-failed.exception';
import { createRandomString } from '../commons/string.common';

export type RequestWithUser = Request & { user: User; payload: any };

@Injectable()
export class VerifyGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) {
      throw new UnauthorizedException();
    }

    const raw = this.extractTokenFromHeader(request);
    const token = this.extractTokenFromRaw(raw);
    const requestAccountWalletAddressId = this.extractWalletFromRaw(raw);
    const requestSignature = this.extractSignatureFromRaw(raw);

    if (!token && !requestAccountWalletAddressId && !requestSignature) {
      throw new UnauthorizedException();
    }

    const now = new Date();

    const decodeWalletAddressIdRaw = atob(requestAccountWalletAddressId);
    const decodeWalletAddressId =
      decodeWalletAddressIdRaw.split('|i|')[0] != null
        ? decodeWalletAddressIdRaw.split('|i|')[0]
        : null;
    const decodeWalletAddressIdTimestamp =
      decodeWalletAddressIdRaw.split('|i|')[1] != null
        ? Number(decodeWalletAddressIdRaw.split('|i|')[1])
        : 0;
    const decodeWalletAddressIdDate = new Date(decodeWalletAddressIdTimestamp);
    const decodeWalletAddressIdDateOnly = new Date(
      decodeWalletAddressIdDate.getFullYear(),
      decodeWalletAddressIdDate.getMonth(),
      decodeWalletAddressIdDate.getDate(),
    );

    const decodeSignatureRaw = atob(requestSignature);
    const decodeSignature =
      decodeSignatureRaw.split('|i|')[0] != null ||
      decodeSignatureRaw.split('|i|')[0] != ''
        ? decodeSignatureRaw.split('|i|')[0]
        : null;
    const decodeSignatureTimestamp =
      decodeSignatureRaw.split('|i|')[1] != null
        ? Number(decodeSignatureRaw.split('|i|')[1])
        : 0;
    const decodeSignatureDate = new Date(decodeSignatureTimestamp);
    const decodeSignatureDateOnly = new Date(
      decodeSignatureDate.getFullYear(),
      decodeSignatureDate.getMonth(),
      decodeSignatureDate.getDate(),
    );

    if (
      decodeWalletAddressIdDateOnly > now &&
      decodeWalletAddressIdDateOnly < now &&
      decodeSignatureDateOnly > now &&
      decodeSignatureDateOnly < now
    ) {
      throw new UnauthorizedException();
    }

    const walletAddress =
      decodeWalletAddressId != null || decodeWalletAddressId != ''
        ? decodeWalletAddressId.split(':')[1] != null
          ? decodeWalletAddressId.split(':')[1]
          : null
        : null;
    if (!walletAddress) {
      throw new UnauthorizedException();
    }

    const signature =
      decodeSignature != null || decodeSignature != ''
        ? decodeSignature.split(':')[1] != null
          ? decodeSignature.split(':')[1]
          : null
        : null;

    if (signature != process.env.AUTH_SIGNATURE) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      if (!walletAddress) {
        throw new Error('Empty wallet address!');
      }

      let user = await this.prisma.user.findFirst({
        where: {
          walletAddress,
        },
      });

      // create new user if not exists
      if (!user) {
        const referralCode = await this.generateReferralCode();

        user = await this.prisma.user.create({
          data: {
            walletAddress,
            referralCode,
            referralCodeLimit: Number(process.env.MAXIMUM_REFERRALS || 10),
          },
        });
      }

      request['payload'] = payload;
      request['user'] = user;
    } catch (error) {
      if (error instanceof VerifyUserFailedException) {
        throw error;
      } else {
        throw new UnauthorizedException();
      }
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractTokenFromRaw(request: string): string | undefined {
    const token = request.split('|i|')[0];
    return token;
  }

  private extractSignatureFromRaw(request: string): string | undefined {
    const signature = request.split('|i|')[1];
    return signature;
  }

  private extractWalletFromRaw(request: string): string | undefined {
    const account = request.split('|i|')[2];
    return account;
  }

  private extractTwitterFromRaw(request: string): string | undefined {
    const account = request.split('|i|')[3];
    return account;
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
}

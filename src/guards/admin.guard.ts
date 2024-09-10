import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AdminGuardFailedException } from '../exceptions/admin-guard-failed.exception';
import { JwtService } from '@nestjs/jwt';
import { adminJwtConstants } from '../constants/auth.constants';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    return await this.validateRequest(request);
  }

  async validateRequest(request: any): Promise<boolean> {
    if (!request.headers.authorization) {
      throw new UnauthorizedException();
    }
    const authorization: string = request.headers.authorization;
    const token = authorization.split(' ')[1];

    try {
      // Verify jwt signature
      const payload = await this.jwtService.verifyAsync(token, {
        secret: adminJwtConstants.secret,
      });

      // Check if the expired time not between now and under 5min, and issued not in 5min
      const now = Date.now();
      const issuedTime = payload.iss * 1000;
      const expiredTime = payload.exp * 1000;
      const prev5min = now - 5 * 60 * 1000;
      const next5Min = now + 5 * 60 * 1000;
      if (
        expiredTime <= now ||
        expiredTime >= next5Min ||
        issuedTime <= prev5min
      ) {
        throw new AdminGuardFailedException('Invalid token expiration');
      }

      const emailAddress = payload.email;
      if (!emailAddress || !emailAddress.endsWith('@manexus.xyz')) {
        throw new AdminGuardFailedException(
          'Invalid email address, please use manexus email',
        );
      }

      // Valid
      return true;
    } catch (error) {
      if (error instanceof AdminGuardFailedException) {
        throw error;
      } else {
        throw new UnauthorizedException();
      }
    }
  }
}

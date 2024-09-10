import { BadRequestException } from '@nestjs/common';

export class AdminGuardFailedException extends BadRequestException {
  constructor(message?: string, errorCode: number = 400) {
    super({
      errorCode,
      message,
    });
  }
}

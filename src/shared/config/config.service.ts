import * as dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  constructor() {
    dotenv.config({
      path: `.env`,
      override: true,
    });

    for (const envName of Object.keys(process.env)) {
      process.env[envName] = process.env[envName].replace(/\\n/g, '\n');
    }
  }

  public get(key: string): string {
    return process.env[key];
  }

  public getNumber(key: string): number {
    return Number(this.get(key));
  }

  get app() {
    return {
      host: this.get('HOST') || 'localhost',
      port: this.get('PORT') || 4000,
      url: this.get('APP_URL') || '',
    };
  }

  get point() {
    return {
      referralJoined: this.getNumber('REFERRAL_JOINED_POINT') || 0,
      successOnboard: this.getNumber('SUCCESS_ONBOARD_POINT') || 0,
    };
  }

  get referrals() {
    return {
      maximum: this.getNumber('MAXIMUM_REFERRALS') || 0,
    };
  }
}

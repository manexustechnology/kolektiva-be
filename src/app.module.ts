import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/auth.constants';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PropertyController } from './app/property/property.controller';
import { PropertyService } from './app/property/property.service';
import { PropertyListingRequestModule } from './app/property-listing-request/property-listing-request.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot: process.env.NODE_ENV === 'development' ? '/' : '/api-docs',
    }),
    ConfigModule.forRoot(),
    SharedModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '300s' },
    }),
    PropertyListingRequestModule,
  ],
  controllers: [AppController, PropertyController],
  providers: [AppService, PropertyService],
})
export class AppModule {}

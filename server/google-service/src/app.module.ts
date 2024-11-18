import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoogleOAuth2Controller } from './oauth2/oauth2.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import constants from './constants';
import { HttpModule } from '@nestjs/axios';
import { GmailController } from './gmail/gmail.controller';
import {
  CacheManagerOptions,
  CacheModule,
  CacheStore,
} from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { YoutubeService } from './youtube/youtube.service';
import { YoutubeController } from './youtube/youtube.controller';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (): Promise<CacheManagerOptions> => {
        const store = await redisStore({
          url: 'redis://redis:6379',
        });
        return {
          store: store as unknown as CacheStore,
          ttl: (60 * 60000) as any,
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      load: [constants],
    }),
    HttpModule,
    ClientsModule.register([
      {
        name: 'USER_MANAGEMENT_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'userManagement',
          protoPath: join(__dirname, 'protos/user-management.proto'),
          url: 'user-management-service:50053',
        },
      },
    ]),
  ],
  controllers: [
    AppController,
    GoogleOAuth2Controller,
    GmailController,
    YoutubeController,
  ],
  providers: [AppService, YoutubeService],
})
export class AppModule {}

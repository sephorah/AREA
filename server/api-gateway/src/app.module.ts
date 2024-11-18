import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { OAuth2Controller } from './oauth2/oauth2.controller';
import { UserManagementController } from './user-management/user-management.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import constants from './constants';
import { AreasController } from './areas/areas.controller';
import { GithubWebhooksService } from './webhooks/github.service';
import {
  CacheManagerOptions,
  CacheModule,
  CacheStore,
} from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [constants],
    }),
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
    ClientsModule.register([
      {
        name: 'AREAS_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'areas',
          protoPath: join(__dirname, 'protos/areas.proto'),
          url: 'areas-service:50055',
        },
      },
      {
        name: 'OAUTH2_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'oauth2',
          protoPath: join(__dirname, 'protos/oauth2.proto'),
          url: 'oauth2-service:50052',
        },
      },
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
    OAuth2Controller,
    UserManagementController,
    AreasController,
  ],
  providers: [AppService, GithubWebhooksService],
})
export class AppModule {}

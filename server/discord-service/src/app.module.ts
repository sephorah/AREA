import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import constants from './constants';
import { HttpModule } from '@nestjs/axios';
import { DiscordOAuth2Controller } from './oauth2/oauth2.controller';
import { DiscordTriggersModule } from './triggers/triggers.module';
import { CacheManagerOptions, CacheModule, CacheStore } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppService } from './app.service';

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
    DiscordTriggersModule,
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
  controllers: [DiscordOAuth2Controller],
  providers: [AppService],
})

export class AppModule {}
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import constants from './constants';
import { HttpModule } from '@nestjs/axios';
import { RedditOAuth2Controller } from './oauth2/oauth2.controller';
import { RedditTriggersModule } from './triggers/triggers.module';
import { RedditTriggersService } from './triggers/triggers.service';
import { RedditTriggersController } from './triggers/triggers.controller';
import {
  CacheManagerOptions,
  CacheModule,
  CacheStore,
} from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { RedditReactionsController } from './reactions/reactions.controller';

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
    RedditTriggersModule,
  ],
  controllers: [
    AppController,
    RedditOAuth2Controller,
    RedditTriggersController,
    RedditReactionsController,
  ],
  providers: [AppService, RedditTriggersService],
})
export class AppModule {}

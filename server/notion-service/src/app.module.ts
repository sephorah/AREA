import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotionOAuth2Controller } from './oauth2/oauth2.controller';
import constants from './constants';
import { redisStore } from 'cache-manager-redis-store';
import { CacheManagerOptions, CacheModule, CacheStore } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { NotionReactionsModule } from './reactions/reactions.module';
import { NotionTriggersModule } from './triggers/triggers.module';

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
    NotionReactionsModule,
    NotionTriggersModule,
  ],
  controllers: [AppController, NotionOAuth2Controller],
  providers: [AppService],
})
export class AppModule {}
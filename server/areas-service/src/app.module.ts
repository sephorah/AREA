import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import constants from './constants';
import { HttpModule } from '@nestjs/axios';
import { AreasController } from './areas/areas.controller';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { SpotifyActionsController } from './actions/spotify.controller';
import { AreasService } from './areas/areas.service';
import { GoogleReactionsController } from './reactions/google.controller';
import {
  CacheModule,
  CacheManagerOptions,
  CacheStore,
} from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { GithubActionsController } from './actions/github.controller';
import { RedditActionsController } from './actions/reddit.controller';
import { RedditReactionsController } from './reactions/reddit.controller';
import { NotionReactionsController } from './reactions/notion.controller';
import { NotionTriggersController } from './actions/notion.controller';
import { WeatherTimeController } from './actions/weather-time.controller';
import { DiscordController } from './actions/discord.controller';
import { GoogleActionsController } from './actions/google.controller';
import { IslamicPrayerActionsController } from './actions/islamic-prayer.controller';
import { SpotifyReactionsController } from './reactions/spotify.controller';
import { GithubReactionsController } from './reactions/github.controller';
import { CoinFlipActionsController } from './actions/coinFlip.controller';

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
      {
        name: 'SPOTIFY_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'spotify',
          protoPath: join(__dirname, 'protos/spotify.proto'),
          url: 'spotify-service:50054',
        },
      },
      {
        name: 'GOOGLE_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'google',
          protoPath: join(__dirname, 'protos/google.proto'),
          url: 'google-service:50051',
        },
      },
      {
        name: 'GITHUB_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'github',
          protoPath: join(__dirname, 'protos/github.proto'),
          url: 'github-service:50058',
        },
      },
      {
        name: 'REDDIT_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'reddit',
          protoPath: join(__dirname, 'protos/reddit.proto'),
          url: 'reddit-service:50059',
        },
      },
      {
        name: 'WEATHER_TIME_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'weathertime',
          protoPath: join(__dirname, 'protos/weather-time.proto'),
          url: 'weather-time-service:50060',
        },
      },
      {
        name: 'DISCORD_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'discord',
          protoPath: join(__dirname, 'protos/discord.proto'),
          url: 'discord-service:50056',
        },
      },
      {
        name: 'COINFLIP_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'coinFlip',
          protoPath: join(__dirname, 'protos/coinFlip.proto'),
          url: 'coin-flip-service:50062',
        },
      },
      {
        name: 'NOTION_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'notion',
          protoPath: join(__dirname, 'protos/notion.proto'),
          url: 'notion-service:50057',
        },
      },
      {
        name: 'ISLAMIC_PRAYER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'islamicprayer',
          protoPath: join(__dirname, 'protos/islamicprayer.proto'),
          url: 'islamic-prayer-service:50061',
        },
      },
    ]),
    ConfigModule.forRoot({
      load: [constants],
    }),
    HttpModule,
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
  ],
  controllers: [
    AppController,
    AreasController,
    WeatherTimeController,
    DiscordController,
    SpotifyActionsController,
    GoogleReactionsController,
    GithubActionsController,
    RedditActionsController,
    RedditReactionsController,
    NotionReactionsController,
    NotionTriggersController,
    GoogleActionsController,
    GithubReactionsController,
    IslamicPrayerActionsController,
    SpotifyReactionsController,
    CoinFlipActionsController,
  ],
  providers: [AppService, AreasService],
})
export class AppModule { }

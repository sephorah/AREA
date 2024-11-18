import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import constants from './constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [constants],
    }),
    ClientsModule.register([
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
        name: 'SPOTIFY_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'spotify',
          protoPath: join(__dirname, 'protos/spotify.proto'),
          url: 'spotify-service:50054',
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
        name: 'GITHUB_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'github',
          protoPath: join(__dirname, 'protos/github.proto'),
          url: 'github-service:50058',
        }
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
        name: 'NOTION_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'notion',
          protoPath: join(__dirname, 'protos/notion.proto'),
          url: 'notion-service:50057',
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

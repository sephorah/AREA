import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import constants from './constants';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import {
  CacheManagerOptions,
  CacheModule,
  CacheStore,
} from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

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
    UserModule,
    JwtModule.register({
      global: true,
      secret: constants().secret,
      signOptions: { expiresIn: '60s' },
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
        name: 'REDIS_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'redis-service',
          port: 50056,
        },
      },
    ]),
  ],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}

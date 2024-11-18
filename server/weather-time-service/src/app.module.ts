import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WeatherTimeTriggersModule } from './triggers/triggers.module';

@Module({
  imports: [
    HttpModule,
    WeatherTimeTriggersModule,
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}
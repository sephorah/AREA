import { Module } from '@nestjs/common';
import { WeatherTimeTriggersService } from './triggers.service';
import { WeatherTimeTriggersController } from './triggers.controller';

@Module({
  imports: [],
  controllers: [WeatherTimeTriggersController],
  providers: [WeatherTimeTriggersService],
})

export class WeatherTimeTriggersModule {}

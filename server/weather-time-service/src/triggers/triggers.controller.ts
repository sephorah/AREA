import { Controller } from '@nestjs/common';
import { WeatherTimeTriggersService } from './triggers.service';
import { GrpcMethod } from '@nestjs/microservices';
import { TimeInParis, WeatherInParis } from 'src/protos/interfaces';

@Controller()
export class WeatherTimeTriggersController {
  constructor(private readonly triggerService: WeatherTimeTriggersService) {}

  @GrpcMethod('WeatherTimeService', 'GetTimeInParis')
  async getTimeInParis(): Promise<TimeInParis> {
    const t = await this.triggerService.getTimeInParis();
    return t;
  }

  @GrpcMethod('WeatherTimeService', 'GetWeatherInParis')
  async getWeather(): Promise<WeatherInParis> {
    const w = await this.triggerService.getWeatherInParis();
    return w;
  }
}

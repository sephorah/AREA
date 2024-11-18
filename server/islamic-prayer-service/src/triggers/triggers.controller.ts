import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { IslamicPrayerTriggersService } from './triggers.service';
import { IslamicPrayerDate, IslamicPrayerFajrTime, IslamicPrayerTime } from 'src/protos/interfaces';

@Controller()
export class IslamicPrayerTriggersController {
  constructor(private readonly triggersService: IslamicPrayerTriggersService) { }

  @GrpcMethod('IslamicPrayerService', 'GetFajrTime')
  async getPrayersToday(): Promise<IslamicPrayerFajrTime> {
    const fajrTime = await this.triggersService.getFajrTime()
    return { fajr: fajrTime };
  }

  @GrpcMethod('IslamicPrayerService', 'GetTime')
  async getTime(): Promise<IslamicPrayerTime> {
    const time = await this.triggersService.getTime()
    return { time: time };
  }

  @GrpcMethod('IslamicPrayerService', 'GetTimestamp')
  async getTimestamp(): Promise<IslamicPrayerTime> {
    const time = await this.triggersService.getTimestamp()
    return { time: time };
  }

  @GrpcMethod('IslamicPrayerService', 'GetDate')
  async getDate(): Promise<IslamicPrayerDate> {
    const date = await this.triggersService.getDate()
    return { date: date };
  }
}

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager'
import { Inject, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class IslamicPrayerTriggersService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

  async getFajrTime(): Promise<string> {
    try {
      const date = (await axios.get('https://api.aladhan.com/v1/currentDate?zone=Europe/Paris')).data.data;
      const fajrTime = (await axios.get(`https://api.aladhan.com/v1/timingsByCity/${date}?city=Paris&country=FR`)).data.data.timings.Fajr;

      return fajrTime;
    } catch (error) {
      Logger.debug(error.response ? error.response.data : error.message)
      throw new RpcException(error);
    }
  }

  async getTime(): Promise<string> {
    try {
      const time = (await axios.get('https://api.aladhan.com/v1/currentTime?zone=Europe/Madrid')).data.data;

      return time;
    } catch (error) {
      Logger.debug(error.response ? error.response.data : error.message)
      throw new RpcException(error);
    }
  }

  async getTimestamp(): Promise<string> {
    try {
      const time = (await axios.get('https://api.aladhan.com/v1/currentTimestamp?zone=Europe/Madrid')).data.data;

      return time;
    } catch (error) {
      Logger.debug(error.response ? error.response.data : error.message)
      throw new RpcException(error);
    }
  }

  async getDate(): Promise<string> {
    try {
      const date = (await axios.get('https://api.aladhan.com/v1/currentDate?zone=Europe/Madrid')).data.data;

      return date;
    } catch (error) {
      Logger.debug(error.response ? error.response.data : error.message)
      throw new RpcException(error);
    }
  }
}

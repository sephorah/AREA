import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { TimeInParis, WeatherInParis } from 'src/protos/interfaces';

@Injectable()
export class WeatherTimeTriggersService {

  async getTimeInParis(): Promise<TimeInParis> {
    const url = 'https://script.google.com/macros/s/AKfycbyd5AcbAnWi2Yn0xhFRbyzS4qMq1VucMVgVvhul5XqS9HkAyJY/exec?tz=Europe/Paris'
    const timeZoneInfo = (await axios.get(url)).data;

    let hours: string = timeZoneInfo.hours
    let minutes: string = timeZoneInfo.minutes

    if (hours.length == 1) {
      hours = '0' + hours
    }
    if (minutes.length == 1) {
      minutes = '0' + minutes
    }
    const time = hours + ':' + minutes

    return { time: time };
  }

  async getWeatherInParis(): Promise<WeatherInParis> {
    const url = 'http://api.weatherapi.com/v1/current.json?key=b69c5968b86c4aa0a9874059242910&q=Paris'
    const timeZoneInfo = (await axios.get(url)).data
    const weather: string = timeZoneInfo.current.temp_c.toString()

    return { weather : weather.split('.')[0] }
  }
}

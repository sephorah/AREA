import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { GithubWebhooksService } from './webhooks/github.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('')
@ApiTags('AREA')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly webhooksService: GithubWebhooksService,
  ) {}

  @Post('')
  redirectWebhooksEvents(@Body() body: any) {
    try {
      Logger.debug('IN API GATEWAY SERVER WBEHOOK URL');
      // Logger.debug('BODY ', JSON.stringify(body));
      this.webhooksService.handleGithubEvents(body);
    } catch (error) {
      Logger.error(error);
      return error;
    }
  }

  @Get('')
  sayHi() {
    return {
      message: 'hi',
    };
  }
}

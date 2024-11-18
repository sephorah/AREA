import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from '../app.service';
import { CreateAreaDto } from './areas.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('')
@ApiTags('AREA')
export class AreasController {
  constructor(private readonly appService: AppService) {}

  @Post('/create/area')
  @ApiOperation({ summary: 'Create an AREA' })
  @UsePipes(new ValidationPipe({ transform: true }))
  createArea(@Body() body: CreateAreaDto) {
    return this.appService.createArea(body);
  }

  @Get('/services')
  @ApiOperation({ summary: 'Get available services' })
  getServices() {
    return this.appService.getServices({});
  }

  @Get('/service/:name/actions')
  @ApiOperation({ summary: 'Get available actions for a service' })
  getActionsPerService(@Param() params: any) {
    return this.appService.getAvailableActionsPerService({ name: params.name });
  }

  @Get('/service/:name/reactions')
  @ApiOperation({ summary: 'Get available reactions for a service' })
  getReactionsPerService(@Param() params: any) {
    return this.appService.getAvailableReactionsPerService({
      name: params.name,
    });
  }

  @Get('/user/:id/areas')
  @ApiOperation({ summary: "Get a user's areas" })
  getAreasByUser(@Param() params: any) {
    return this.appService.getAreasByUser({
      userId: params.id,
    });
  }

  @Get('deleteAllAreas')
  deleteAllAreas() {
    return this.appService.deleteAllAreas();
  }

  @Get('about.json')
  async getAboutJson(@Req() request) {
    const currentTime = Math.floor(Date.now() / 1000);
    const ipv6MappedIp = request.ip;

    const host = ipv6MappedIp.startsWith('::ffff:')
      ? ipv6MappedIp.replace('::ffff:', '')
      : ipv6MappedIp;

    return {
      client: {
        host: host,
      },
      server: {
        current_time: currentTime,
        services: await this.appService.getServicesInfo(),
      },
    };
  }
}

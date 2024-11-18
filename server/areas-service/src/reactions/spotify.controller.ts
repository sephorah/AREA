import { Controller, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { AreasService } from '../areas/areas.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { AppService } from 'src/app.service';
import { REACTION } from 'src/avaliable-areas';
import { ReactionParams } from 'src/protos/interfaces';

@Controller('')
export class SpotifyReactionsController {
  constructor(
    private eventEmitter: EventEmitter2,
    private readonly appService: AppService,
    private readonly areasService: AreasService,
  ) {}

  @OnEvent(REACTION.SPOTIFY_START_RESUME_PLAYBACK)
  async startResumePlayback() {
    try {
      Logger.debug('START SPOTIFY');
      this.appService.startResumePlayback({});
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  @OnEvent(REACTION.SPOTIFY_PAUSE_PLAYBACK)
  async pausePlayback() {
    try {
      Logger.debug('PAUSE SPOTIFY');
      this.appService.pausePlayback({});
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  @OnEvent(REACTION.SPOTIFY_SKIP_TO_NEXT_MUSIC)
  async skipToNextMusic() {
    try {
      Logger.debug('NEXT SPOTIFY');
      this.appService.skipToNextMusic({});
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }
}

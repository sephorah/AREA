import { Controller, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { AreasService } from '../areas/areas.service';
import { AreaParams } from 'src/protos/interfaces';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { AppService } from 'src/app.service';
import { REACTION } from 'src/avaliable-areas';

type ReactionParams = Pick<AreaParams, 'reactionParams' | 'ownerId'>;

@Controller('')
export class RedditReactionsController {
  constructor(
    private eventEmitter: EventEmitter2,
    private readonly appService: AppService,
    private readonly areasService: AreasService,
  ) {}

  @OnEvent(REACTION.REDDIT_SUBMIT_TEXT)
  async submitTextReddit(reaction: ReactionParams) {
    // Logger.debug('hOLA');
    try {
      const params = JSON.parse(reaction.reactionParams);
      Logger.debug('PARAMS OF SUBMIT TEXT', params);
      this.appService.submitText({
        subreddit: params.subreddit,
        title: params.title,
        text: params.text,
      });
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  @OnEvent(REACTION.REDDIT_SUBMIT_LINK)
  async submitLinkReddit(reaction: ReactionParams) {
    Logger.debug('hOLA');
    try {
      const params = JSON.parse(reaction.reactionParams);
      Logger.debug('PARAMS OF SUBMIT LINK', params);
      this.appService.submitLink({
        url: params.url,
        subreddit: params.subreddit,
        title: params.title,
        text: params.text,
      });
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }
}

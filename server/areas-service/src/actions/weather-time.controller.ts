import { Controller, Logger, Inject } from '@nestjs/common'
import { AreaParams, HandleCreateIssue, HandleCreateIssueComment, HandleSubmitLink, HandleSubmitText } from 'src/protos/interfaces';
import { RpcException } from '@nestjs/microservices';
import { ACTION, REACTION } from 'src/avaliable-areas';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { AppService } from 'src/app.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager'

interface HandleEmailReactionParams {
  body: string;
  reaction: string;
  reactionParams: string;
  ownerId: string;
}

@Controller('')
export class WeatherTimeController {

  constructor(
    private eventEmitter: EventEmitter2,
    private readonly appService: AppService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  handleSubmitTextReaction({
    title,
    text,
    reaction,
    reactionParams,
    ownerId,
  }: HandleSubmitText) {
    const oldReactionParams = JSON.parse(reactionParams);
    const newReactionParams = JSON.stringify({
      subreddit: oldReactionParams.subreddit,
      title: title,
      text: text,
    });
    this.eventEmitter.emit(reaction, {
      reactionParams: newReactionParams,
      ownerId: ownerId,
    });
  }

  handleSubmitLinkReaction({
    title,
    text,
    reaction,
    reactionParams,
    ownerId,
    url,
  }: HandleSubmitLink) {
    const oldReactionParams = JSON.parse(reactionParams);
    const newReactionParams = JSON.stringify({
      subreddit: oldReactionParams.subreddit,
      url: url,
      title: title,
      text: text,
    });
    this.eventEmitter.emit(reaction, {
      reactionParams: newReactionParams,
      ownerId: ownerId,
    });
  }

  handleEmailReaction({
    body,
    reaction,
    reactionParams,
    ownerId,
  }: HandleEmailReactionParams) {
    const oldReactionParams = JSON.parse(reactionParams);
    const newReactionParams = JSON.stringify({
      body: body,
      recipient: oldReactionParams.recipient,
      subject: 'Weather or Time via AREA',
    });
    this.eventEmitter.emit(reaction, {
      reactionParams: newReactionParams,
      ownerId: ownerId,
    });
  }

  handleNewBlock({
    text,
    reaction,
    reactionParams,
    ownerId
  }: {
    text: string,
    reaction: string,
    reactionParams: string
    ownerId: string,
  }) {
    const oldReactionParams = JSON.parse(reactionParams);
    const newReactionParams = JSON.stringify({
      text: text,
      pageId: oldReactionParams.pageId
    });
    this.eventEmitter.emit(reaction, {
      reactionParams: newReactionParams,
      ownerId: ownerId
    });
  }

  handleNewComment({
    text,
    reaction,
    reactionParams,
    ownerId
  }: {
    text: string,
    reaction: string,
    reactionParams: string
    ownerId: string,
  }) {
    const oldReactionParams = JSON.parse(reactionParams);
    const newReactionParams = JSON.stringify({
      text: text,
      pageId: oldReactionParams.pageId
    });
    this.eventEmitter.emit(reaction, {
      reactionParams: newReactionParams,
      ownerId: ownerId
    });
  }

  handleUpdateBlock({
    text,
    reaction,
    reactionParams,
    ownerId
  }: {
    text: string,
    reaction: string,
    reactionParams: string
    ownerId: string,
  }) {
    const oldReactionParams = JSON.parse(reactionParams);
    const newReactionParams = JSON.stringify({
      text: text,
      blockId: oldReactionParams.blockId
    });
    this.eventEmitter.emit(reaction, {
      reactionParams: newReactionParams,
      ownerId: ownerId
    });
  }

  handleCreateIssueReaction({
    body,
    title,
    reaction,
    reactionParams,
    ownerId,
  }: HandleCreateIssue) {
    const oldReactionParams = JSON.parse(reactionParams);
    Logger.debug('OLD REACTION', oldReactionParams, typeof oldReactionParams);
    Logger.debug(oldReactionParams.repoName, oldReactionParams.owner);
    const newReactionParams = JSON.stringify({
      repoName: oldReactionParams.repoName,
      owner: oldReactionParams.owner,
      title: title,
      body: body,
    });
    Logger.debug('NEW REACTIONS PARAMS', newReactionParams);
    this.eventEmitter.emit(reaction, {
      reactionParams: newReactionParams,
      ownerId: ownerId,
    });
  }

  handleCreateIssueCommentReaction({
    body,
    reaction,
    reactionParams,
    ownerId,
  }: HandleCreateIssueComment) {
    const oldReactionParams = JSON.parse(reactionParams);
    const newReactionParams = JSON.stringify({
      repoName: oldReactionParams.repoName,
      owner: oldReactionParams.owner,
      issueNumber: oldReactionParams.issueNumber,
      body: body,
    });
    this.eventEmitter.emit(reaction, {
      reactionParams: newReactionParams,
      ownerId: ownerId,
    });
  }

  @OnEvent(ACTION.WEATHER_TIME_AT_SELECTED_TIME)
  async checkTime(args: Omit<AreaParams, 'action'>) {
    try {
      const getTime = await this.appService.getTimeInParis({})
      const time_to_search = JSON.parse(args.actionParams).selected_time;

      if (time_to_search === getTime.time) {
        if (
          args.reaction == REACTION.GMAIL_SEND_EMAIL ||
          args.reaction == REACTION.GMAIL_SEND_EMAIL_TO_YOURSELF
        ) {
          const body = `Its time ! It's actually ${getTime.time} in Paris\n`;
          this.handleEmailReaction({
            body,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,  
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_TEXT) {

          this.handleSubmitTextReaction({
            title: `Time is up !`,
            text: `Its time ! It's actually ${getTime.time} in Paris\n`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_LINK) {
          this.handleSubmitLinkReaction({
            title: `Time is up !`,
            text: `Its time ! It's actually ${getTime.time} in Paris\n`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
            url: '',
          });
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_BLOCK) {
          this.handleUpdateBlock({
            text: `Its time ! It's actually ${getTime.time} in Paris\n`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId
          })
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_COMMENT) {
          this.handleNewComment({
            text: `Its time ! It's actually ${getTime.time} in Paris\n`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId
          })
        }
        if (args.reaction == REACTION.NOTION_UPDATE_BLOCK) {
          this.handleUpdateBlock({
            text: `Its time ! It's actually ${getTime.time} in Paris\n`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId
          })
        }
        if (args.reaction == REACTION.NOTION_DELETE_BLOCK) {
          this.eventEmitter.emit(args.reaction, {
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.NOTION_CREATE_PAGE
          || REACTION.NOTION_CREATE_DATABASE
          || REACTION.NOTION_UPDATE_DATABASE_TITLE
        ) {
          this.eventEmitter.emit(args.reaction, {
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (
          args.reaction == REACTION.SPOTIFY_PAUSE_PLAYBACK ||
          args.reaction == REACTION.SPOTIFY_SKIP_TO_NEXT_MUSIC ||
          args.reaction == REACTION.SPOTIFY_START_RESUME_PLAYBACK
        ) {
          this.eventEmitter.emit(args.reaction);
        }
        if (args.reaction == REACTION.GITHUB_CREATE_ISSUE) {
          this.handleCreateIssueReaction({
            title: `Time is up !`,
            body: `Its time ! It's actually ${getTime.time} in Paris\n`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.GITHUB_CREATE_ISSUE_COMMENT) {
          this.handleCreateIssueCommentReaction({
            body: `Its time ! It's actually ${getTime.time} in Paris\n`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
      }

    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  @OnEvent(ACTION.WEATHER_TIME_WEATHER_CHANGED)
  async weatherChanged(args: Omit<AreaParams, 'action'>) {
    try {
      const getWeather = (await this.appService.getWeatherInParis({})).weather
      const time_to_search = await this.cacheManager.get('weather')

      if (time_to_search === null) {
        this.cacheManager.set('weather', getWeather);
        return;
      }

      if (time_to_search !== getWeather) {
        if (
          args.reaction == REACTION.GMAIL_SEND_EMAIL ||
          args.reaction == REACTION.GMAIL_SEND_EMAIL_TO_YOURSELF
        ) {
          const body = `The weather changed ! Actually it's ${getWeather} degres celsius in Paris\n`;
          this.handleEmailReaction({
            body,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_TEXT) {

          this.handleSubmitTextReaction({
            title: `Weather changed`,
            text: `The weather changed ! Actually it's ${getWeather} degres celsius in Paris\n`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_LINK) {
          this.handleSubmitLinkReaction({
            title: `Weather changed`,
            text: `The weather changed ! Actually it's ${getWeather} degres celsius in Paris\n`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
            url: '',
          });
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_BLOCK) {
          this.handleUpdateBlock({
            text: `The weather changed ! Actually it's ${getWeather} degres celsius in Paris\n`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId
          })
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_COMMENT) {
          this.handleNewComment({
            text: `The weather changed ! Actually it's ${getWeather} degres celsius in Paris\n`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId
          })
        }
        if (args.reaction == REACTION.NOTION_UPDATE_BLOCK) {
          this.handleUpdateBlock({
            text: `The weather changed ! Actually it's ${getWeather} degres celsius in Paris\n`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId
          })
        }
        if (args.reaction == REACTION.NOTION_DELETE_BLOCK) {
          this.eventEmitter.emit(args.reaction, {
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.NOTION_CREATE_PAGE
          || REACTION.NOTION_CREATE_DATABASE
          || REACTION.NOTION_UPDATE_DATABASE_TITLE
        ) {
          this.eventEmitter.emit(args.reaction, {
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (
          args.reaction == REACTION.SPOTIFY_PAUSE_PLAYBACK ||
          args.reaction == REACTION.SPOTIFY_SKIP_TO_NEXT_MUSIC ||
          args.reaction == REACTION.SPOTIFY_START_RESUME_PLAYBACK
        ) {
          this.eventEmitter.emit(args.reaction);
        }
        if (args.reaction == REACTION.GITHUB_CREATE_ISSUE) {
          this.handleCreateIssueReaction({
            title: `Weather changed`,
            body: `The weather changed ! Actually it's ${getWeather} degres celsius in Paris\n`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.GITHUB_CREATE_ISSUE_COMMENT) {
          this.handleCreateIssueCommentReaction({
            body: `The weather changed ! Actually it's ${getWeather} degres celsius in Paris\n`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
      }

    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }
}
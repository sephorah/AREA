import { Controller, Inject, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { AppService } from 'src/app.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ACTION, REACTION } from 'src/avaliable-areas';
import { AreaParams, HandleCreateIssue, HandleCreateIssueComment, HandleEmailReactionParams, HandleSubmitLink, HandleSubmitText } from 'src/protos/interfaces';

@Controller('')
export class IslamicPrayerActionsController {
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
      subject: 'Notion via AREA',
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

  @OnEvent(ACTION.ISLAMIC_PRAYER_AT_TIME_SELECTED)
  async checkTimeSelected(args: Omit<AreaParams, 'action'>) {
    try {
      const timeSelected = JSON.parse(args.actionParams).time;
      const time = (await this.appService.islamicPrayerGetTime()).time;
      
      if (timeSelected === time) {
        if (
          args.reaction == REACTION.GMAIL_SEND_EMAIL ||
          args.reaction == REACTION.GMAIL_SEND_EMAIL_TO_YOURSELF
        ) {
          const body = `It's time ${time} !`;
          this.handleEmailReaction({
            body,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_TEXT) {

          this.handleSubmitTextReaction({
            title: `Actual time`,
            text: `It's time ${time} !`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_LINK) {
          this.handleSubmitLinkReaction({
            title: `Actual time`,
            text: `It's time ${time} !`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
            url: '',
          });
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_BLOCK) {
          this.handleUpdateBlock({
            text: `It's time ${time} !`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId
          })
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_COMMENT) {
          this.handleNewComment({
            text: `It's time ${time} !`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId
          })
        }
        if (args.reaction == REACTION.NOTION_UPDATE_BLOCK) {
          this.handleUpdateBlock({
            text: `It's time ${time} !`,
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
            title: `Actual time`,
            body: `It's time ${time} !`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.GITHUB_CREATE_ISSUE_COMMENT) {
          this.handleCreateIssueCommentReaction({
            body: `It's time ${time} !`,
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

  @OnEvent(ACTION.ISLAMIC_PRAYER_FAJR_TODAY)
  async checkFajrTime(args: Omit<AreaParams, 'action'>) {
    try {
      const fajrTime = (await this.appService.islamicPrayerGetFajrTime()).fajr;
      const time = (await this.appService.islamicPrayerGetTime()).time;


      if (fajrTime === time) {
        if (
          args.reaction == REACTION.GMAIL_SEND_EMAIL ||
          args.reaction == REACTION.GMAIL_SEND_EMAIL_TO_YOURSELF
        ) {
          const body = `It's Fajr time ${time} !`;
          this.handleEmailReaction({
            body,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_TEXT) {

          this.handleSubmitTextReaction({
            title: `Fajr time`,
            text: `It's Fajr time ${time} !`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_LINK) {
          this.handleSubmitLinkReaction({
            title: `Fajr time`,
            text: `It's Fajr time ${time} !`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
            url: '',
          });
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_BLOCK) {
          this.handleUpdateBlock({
            text: `It's Fajr time ${time} !`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId
          })
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_COMMENT) {
          this.handleNewComment({
            text: `It's Fajr time ${time} !`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId
          })
        }
        if (args.reaction == REACTION.NOTION_UPDATE_BLOCK) {
          this.handleUpdateBlock({
            text: `It's Fajr time ${time} !`,
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
            title: `Fajr time`,
            body: `It's Fajr time ${time} !`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.GITHUB_CREATE_ISSUE_COMMENT) {
          this.handleCreateIssueCommentReaction({
            body: `It's Fajr time ${time} !`,
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

  @OnEvent(ACTION.ISLAMIC_PRAYER_AT_TIMESTAMP)
  async checkTimestamp(args: Omit<AreaParams, 'action'>) {
    try {
      const timeSelected = JSON.parse(args.actionParams).timestamp;
      const time = (await this.appService.islamicPrayerGetTimestamp()).time;
      
      if (timeSelected === time) {
        if (
          args.reaction == REACTION.GMAIL_SEND_EMAIL ||
          args.reaction == REACTION.GMAIL_SEND_EMAIL_TO_YOURSELF
        ) {
          const body = `It's time ${time} !`;
          this.handleEmailReaction({
            body,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_TEXT) {

          this.handleSubmitTextReaction({
            title: `Actual time`,
            text: `It's time ${time} !`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_LINK) {
          this.handleSubmitLinkReaction({
            title: `Actual time`,
            text: `It's time ${time} !`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
            url: '',
          });
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_BLOCK) {
          this.handleUpdateBlock({
            text: `It's time ${time} !`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId
          })
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_COMMENT) {
          this.handleNewComment({
            text: `It's time ${time} !`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId
          })
        }
        if (args.reaction == REACTION.NOTION_UPDATE_BLOCK) {
          this.handleUpdateBlock({
            text: `It's time ${time} !`,
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
            title: `Timestamp reached`,
            body: `It's time ${time} !`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.GITHUB_CREATE_ISSUE_COMMENT) {
          this.handleCreateIssueCommentReaction({
            body: `It's time ${time} !`,
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

  @OnEvent(ACTION.ISLAMIC_PRAYER_AT_DATE)
  async checkDate(args: Omit<AreaParams, 'action'>) {
    try {
      const dateSelected = JSON.parse(args.actionParams).date;
      const date = (await this.appService.islamicPrayerGetDate()).date;
      
      if (dateSelected === date) {
        if (
          args.reaction == REACTION.GMAIL_SEND_EMAIL ||
          args.reaction == REACTION.GMAIL_SEND_EMAIL_TO_YOURSELF
        ) {
          const body = `It's time ${date} !`;
          this.handleEmailReaction({
            body,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_TEXT) {

          this.handleSubmitTextReaction({
            title: `Actual date`,
            text: `It's date ${date} !`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_LINK) {
          this.handleSubmitLinkReaction({
            title: `Actual date`,
            text: `It's date ${date} !`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
            url: '',
          });
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_BLOCK) {
          this.handleUpdateBlock({
            text: `It's date ${date} !`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId
          })
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_COMMENT) {
          this.handleNewComment({
            text: `It's date ${date} !`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId
          })
        }
        if (args.reaction == REACTION.NOTION_UPDATE_BLOCK) {
          this.handleUpdateBlock({
            text: `It's date ${date} !`,
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
            title: `Actual date`,
            body: `It's date ${date} !`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.GITHUB_CREATE_ISSUE_COMMENT) {
          this.handleCreateIssueCommentReaction({
            body: `It's date ${date} !`,
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

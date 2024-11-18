import { Controller, Inject, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {
  AreaParams,
  HandleCreateIssue,
  HandleCreateIssueComment,
  HandleEmailReactionParams,
  HandleSubmitLink,
  HandleSubmitText,
  NewLikedVideo,
  NewSubscription,
} from 'src/protos/interfaces';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { AppService } from 'src/app.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ACTION, REACTION } from 'src/avaliable-areas';
import { getFormattedDate } from 'src/utils';

@Controller('')
export class GoogleActionsController {
  constructor(
    private eventEmitter: EventEmitter2,
    private readonly appService: AppService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  handleCreateIssueReaction({
    body,
    title,
    reaction,
    reactionParams,
    ownerId,
  }: HandleCreateIssue) {
    const oldReactionParams = JSON.parse(reactionParams);
    const newReactionParams = JSON.stringify({
      repoName: oldReactionParams.repoName,
      owner: oldReactionParams.owner,
      title: title,
      body: body,
    });
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
      subject: 'Youtube via AREA',
    });
    this.eventEmitter.emit(reaction, {
      reactionParams: newReactionParams,
      ownerId: ownerId,
    });
  }

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
    // Logger.debug('SPOTIFY SEND TO REDDIT SUBMIT TEXT', reaction );
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

  handleNewBlock({
    text,
    reaction,
    reactionParams,
    ownerId,
  }: {
    text: string;
    reaction: string;
    reactionParams: string;
    ownerId: string;
  }) {
    const oldReactionParams = JSON.parse(reactionParams);
    const newReactionParams = JSON.stringify({
      text: text,
      pageId: oldReactionParams.pageId,
    });
    this.eventEmitter.emit(reaction, {
      reactionParams: newReactionParams,
      ownerId: ownerId,
    });
  }

  handleNewComment({
    text,
    reaction,
    reactionParams,
    ownerId,
  }: {
    text: string;
    reaction: string;
    reactionParams: string;
    ownerId: string;
  }) {
    const oldReactionParams = JSON.parse(reactionParams);
    const newReactionParams = JSON.stringify({
      text: text,
      pageId: oldReactionParams.pageId,
    });
    this.eventEmitter.emit(reaction, {
      reactionParams: newReactionParams,
      ownerId: ownerId,
    });
  }

  handleUpdateBlock({
    text,
    reaction,
    reactionParams,
    ownerId,
  }: {
    text: string;
    reaction: string;
    reactionParams: string;
    ownerId: string;
  }) {
    const oldReactionParams = JSON.parse(reactionParams);
    const newReactionParams = JSON.stringify({
      text: text,
      blockId: oldReactionParams.blockId,
    });
    this.eventEmitter.emit(reaction, {
      reactionParams: newReactionParams,
      ownerId: ownerId,
    });
  }

  @OnEvent(ACTION.YOUTUBE_NEW_LIKED_VIDEO)
  async checkNewLikedVideos(args: Omit<AreaParams, 'action'>) {
    try {
      const newLikedVideos = (await this.appService.checkNewLikedVideos({}))
        .newLikedVideos;
      Logger.log('Check new liked videos on Youtube...');
      Logger.debug('NEW LIKES', newLikedVideos);
      if (newLikedVideos && newLikedVideos.length > 0) {
        Logger.log('New liked videos on Youtube');
        if (
          args.reaction == REACTION.GMAIL_SEND_EMAIL ||
          args.reaction == REACTION.GMAIL_SEND_EMAIL_TO_YOURSELF
        ) {
          const likedVideos = newLikedVideos
            .map((video: NewLikedVideo) =>
              video
                ? `${video.title} by ${video.channel} published at ${getFormattedDate(new Date(video.publishedAt))} ${video.url}`
                : '',
            )
            .join('\n');
          const body = `You recently liked the following videos:\n${likedVideos}\n\n`;
          this.handleEmailReaction({
            body,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_TEXT) {
          const likedVideos = newLikedVideos
            .map((video: NewLikedVideo) =>
              video
                ? `${video.title} by ${video.channel} published at ${getFormattedDate(new Date(video.publishedAt))}`
                : '',
            )
            .join('\n\n');
          //   Logger.debug('HEYYYOO IN', args);
          this.handleSubmitTextReaction({
            title: 'New liked videos on Youtube',
            text: likedVideos,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_LINK) {
          for (const video of newLikedVideos) {
            this.handleSubmitLinkReaction({
              title: 'New liked video',
              text: `${video.title} by ${video.channel} published at ${getFormattedDate(new Date(video.publishedAt))}`,
              reaction: args.reaction,
              reactionParams: args.reactionParams,
              ownerId: args.ownerId,
              url: video.url,
            });
          }
        }
        if (
          args.reaction == REACTION.SPOTIFY_PAUSE_PLAYBACK ||
          args.reaction == REACTION.SPOTIFY_SKIP_TO_NEXT_MUSIC ||
          args.reaction == REACTION.SPOTIFY_START_RESUME_PLAYBACK
        ) {
          this.eventEmitter.emit(args.reaction);
        }
        if (args.reaction == REACTION.GITHUB_CREATE_ISSUE) {
          const likedVideos = newLikedVideos
            .map((video: NewLikedVideo) =>
              video
                ? `${video.title} by ${video.channel} published at ${getFormattedDate(new Date(video.publishedAt))}`
                : '',
            )
            .join('\n');
          this.handleCreateIssueReaction({
            title: 'New liked videos on Youtube',
            body: likedVideos,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.GITHUB_CREATE_ISSUE_COMMENT) {
          for (const video of newLikedVideos) {
            this.handleCreateIssueCommentReaction({
              body: `New liked video ${video.title} by ${video.channel}`,
              reaction: args.reaction,
              reactionParams: args.reactionParams,
              ownerId: args.ownerId,
            });
          }
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_BLOCK) {
          for (const video of newLikedVideos) {
            this.handleUpdateBlock({
              text: `New liked video ${video.title} by ${video.channel}`,
              reaction: args.reaction,
              reactionParams: args.reactionParams,
              ownerId: args.ownerId,
            });
          }
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_COMMENT) {
          for (const video of newLikedVideos) {
            this.handleNewComment({
              text: `New liked video ${video.title} by ${video.channel}`,
              reaction: args.reaction,
              reactionParams: args.reactionParams,
              ownerId: args.ownerId,
            });
          }
        }
        if (args.reaction == REACTION.NOTION_UPDATE_BLOCK) {
          for (const video of newLikedVideos) {
            this.handleUpdateBlock({
              text: `New liked video ${video.title} by ${video.channel}`,
              reaction: args.reaction,
              reactionParams: args.reactionParams,
              ownerId: args.ownerId,
            });
          }
        }
        if (args.reaction == REACTION.NOTION_DELETE_BLOCK) {
          this.eventEmitter.emit(args.reaction, {
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (
          args.reaction == REACTION.NOTION_CREATE_PAGE ||
          REACTION.NOTION_CREATE_DATABASE ||
          REACTION.NOTION_UPDATE_DATABASE_TITLE
        ) {
          this.eventEmitter.emit(args.reaction, {
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

  @OnEvent(ACTION.YOUTUBE_NEW_SUBSCRIPTION)
  async checkNewSubscriptions(args: Omit<AreaParams, 'action'>) {
    try {
      const newSubscriptions = (await this.appService.checkNewSubscriptions({}))
        .newSubscriptions;
      Logger.log('Check new subscriptions on Youtube...');
      Logger.debug('NEW SUBS', newSubscriptions);
      if (newSubscriptions && newSubscriptions.length > 0) {
        Logger.log('New subscriptions on Youtube');
        if (
          args.reaction == REACTION.GMAIL_SEND_EMAIL ||
          args.reaction == REACTION.GMAIL_SEND_EMAIL_TO_YOURSELF
        ) {
          const subscriptions = newSubscriptions
            .map((channel: NewSubscription) =>
              channel ? `${channel.title} (${channel.url})` : '',
            )
            .join('\n');
          const body = `You recently subscribed to the following channels:\n${subscriptions}\n\n`;
          this.handleEmailReaction({
            body,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_TEXT) {
          const subscriptions = newSubscriptions
            .map((channel: NewSubscription) =>
              channel ? `${channel.title} (${channel.url})` : '',
            )
            .join('\n\n');
          //   Logger.debug('HEYYYOO IN', args);
          this.handleSubmitTextReaction({
            title: 'New subscriptions on Youtube',
            text: subscriptions,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_LINK) {
          for (const channel of newSubscriptions) {
            this.handleSubmitLinkReaction({
              title: 'New subscription',
              text: `${channel.title} (${channel.url})`,
              reaction: args.reaction,
              reactionParams: args.reactionParams,
              ownerId: args.ownerId,
              url: channel.url,
            });
          }
        }
        if (
          args.reaction == REACTION.SPOTIFY_PAUSE_PLAYBACK ||
          args.reaction == REACTION.SPOTIFY_SKIP_TO_NEXT_MUSIC ||
          args.reaction == REACTION.SPOTIFY_START_RESUME_PLAYBACK
        ) {
          this.eventEmitter.emit(args.reaction);
        }
        if (args.reaction == REACTION.GITHUB_CREATE_ISSUE) {
          const subscriptions = newSubscriptions
            .map((channel: NewSubscription) =>
              channel ? `${channel.title} (${channel.url})` : '',
            )
            .join('\n');
          this.handleCreateIssueReaction({
            title: 'New subscriptions on Youtube',
            body: subscriptions,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.GITHUB_CREATE_ISSUE_COMMENT) {
          for (const channel of newSubscriptions) {
            this.handleCreateIssueCommentReaction({
              body: `New subscription: ${channel.title} (${channel.url})`,
              reaction: args.reaction,
              reactionParams: args.reactionParams,
              ownerId: args.ownerId,
            });
          }
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_BLOCK) {
          for (const channel of newSubscriptions) {
            this.handleUpdateBlock({
              text: `New subscription: ${channel.title} (${channel.url})`,
              reaction: args.reaction,
              reactionParams: args.reactionParams,
              ownerId: args.ownerId,
            });
          }
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_COMMENT) {
          for (const channel of newSubscriptions) {
            this.handleNewComment({
              text: `New subscription: ${channel.title} (${channel.url})`,
              reaction: args.reaction,
              reactionParams: args.reactionParams,
              ownerId: args.ownerId,
            });
          }
        }
        if (args.reaction == REACTION.NOTION_UPDATE_BLOCK) {
          for (const channel of newSubscriptions) {
            this.handleUpdateBlock({
              text: `New subscription: ${channel.title} (${channel.url})`,
              reaction: args.reaction,
              reactionParams: args.reactionParams,
              ownerId: args.ownerId,
            });
          }
        }
        if (args.reaction == REACTION.NOTION_DELETE_BLOCK) {
          this.eventEmitter.emit(args.reaction, {
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (
          args.reaction == REACTION.NOTION_CREATE_PAGE ||
          REACTION.NOTION_CREATE_DATABASE ||
          REACTION.NOTION_UPDATE_DATABASE_TITLE
        ) {
          this.eventEmitter.emit(args.reaction, {
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

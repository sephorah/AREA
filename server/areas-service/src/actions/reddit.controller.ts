import { Controller, Inject, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {
  AreaParams,
  HandleCreateIssue,
  HandleCreateIssueComment,
  HandleSubmitLink,
  HandleSubmitText,
  NewSavedPost,
} from 'src/protos/interfaces';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { AppService } from 'src/app.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ACTION, REACTION } from 'src/avaliable-areas';
import { getFormattedDate } from 'src/utils';

interface HandleEmailReactionParams {
  body: string;
  reaction: string;
  reactionParams: string;
  ownerId: string;
}

@Controller('')
export class RedditActionsController {
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
      subject: 'Reddit via AREA',
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

  @OnEvent(ACTION.REDDIT_NEW_SAVED_POST)
  async checkNewSavedPosts(args: Omit<AreaParams, 'action'>) {
    try {
      const newSavedPosts = (await this.appService.checkUserSavedPosts({}))
        .newSavedPosts;
      Logger.log('Check new saved posts on Reddit...');
      // Logger.debug('NEW SAVED POSTS', newSavedPosts);
      if (newSavedPosts && newSavedPosts.length > 0) {
        Logger.log('New saved posts on Reddit');
        if (
          args.reaction == REACTION.GMAIL_SEND_EMAIL ||
          args.reaction == REACTION.GMAIL_SEND_EMAIL_TO_YOURSELF
        ) {
          const posts = newSavedPosts
            .map((post: NewSavedPost) =>
              post
                ? `"${post.titlePost}" via /r/${post.subreddit} at ${getFormattedDate(new Date(parseInt(post.postedAt) * 1000))} reddit.com${post.postURL}`
                : '',
            )
            .join('\n');
          const body = `You recently saved the following posts/comments:\n${posts}\n\n`;
          this.handleEmailReaction({
            body,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_TEXT) {
          const posts = newSavedPosts
            .map((post: NewSavedPost) =>
              post
                ? `"${post.titlePost}" via /r/${post.subreddit} at ${getFormattedDate(new Date(parseInt(post.postedAt) * 1000))}`
                : '',
            )
            .join('\n\n');
          this.handleSubmitTextReaction({
            title: 'New saved posts/comments on Reddit',
            text: posts,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_LINK) {
          for (const post of newSavedPosts) {
            this.handleSubmitLinkReaction({
              title: 'New saved post on Reddit',
              text: `"${post.titlePost}" via /r/${post.subreddit} at ${getFormattedDate(new Date(parseInt(post.postedAt) * 1000))}`,
              reaction: args.reaction,
              reactionParams: args.reactionParams,
              ownerId: args.ownerId,
              url: post.postURL,
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
          const posts = newSavedPosts
            .map((post: NewSavedPost) =>
              post
                ? `"${post.titlePost}" via /r/${post.subreddit} at ${getFormattedDate(new Date(parseInt(post.postedAt) * 1000))} reddit.com${post.postURL}`
                : '',
            )
            .join('\n');
          this.handleCreateIssueReaction({
            title: 'New saved posts on Reddit',
            body: posts,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.GITHUB_CREATE_ISSUE_COMMENT) {
          for (const post of newSavedPosts) {
            this.handleCreateIssueCommentReaction({
              body: `New saved post on Reddit ${post.titlePost} (${post.postURL})`,
              reaction: args.reaction,
              reactionParams: args.reactionParams,
              ownerId: args.ownerId,
            });
          }
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_BLOCK) {
          for (const post of newSavedPosts) {
            this.handleUpdateBlock({
              text: `New saved post on Reddit ${post.titlePost} (${post.postURL})`,
              reaction: args.reaction,
              reactionParams: args.reactionParams,
              ownerId: args.ownerId,
            });
          }
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_COMMENT) {
          for (const post of newSavedPosts) {
            this.handleNewComment({
              text: `New saved post on Reddit ${post.titlePost} (${post.postURL})`,
              reaction: args.reaction,
              reactionParams: args.reactionParams,
              ownerId: args.ownerId,
            });
          }
        }
        if (args.reaction == REACTION.NOTION_UPDATE_BLOCK) {
          for (const post of newSavedPosts) {
            this.handleUpdateBlock({
              text: `New saved post on Reddit ${post.titlePost} (${post.postURL})`,
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

  @OnEvent(ACTION.REDDIT_NEW_UPVOTED_POST)
  async checkNewUpvotedPosts(args: Omit<AreaParams, 'action'>) {
    try {
      const newUpvotedPosts = (await this.appService.checkUserUpvotedPosts({}))
        .newUpDownvotedPosts;
      Logger.log('Check new upvoted posts on Reddit...');
      Logger.debug('NEW UPVOTED POSTS', newUpvotedPosts);
      if (newUpvotedPosts && newUpvotedPosts.length > 0) {
        Logger.log('New upvoted posts on Reddit');
        if (
          args.reaction == REACTION.GMAIL_SEND_EMAIL ||
          args.reaction == REACTION.GMAIL_SEND_EMAIL_TO_YOURSELF
        ) {
          const posts = newUpvotedPosts
            .map((post: NewSavedPost) =>
              post
                ? `${post.titlePost} via /r/${post.subreddit} at ${getFormattedDate(new Date(parseInt(post.postedAt) * 1000))} reddit.com${post.postURL}`
                : '',
            )
            .join('\n');
          const body = `You recently upvoted the following posts:\n${posts}\n\n`;
          this.handleEmailReaction({
            body,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_TEXT) {
          const posts = newUpvotedPosts
            .map((post: NewSavedPost) =>
              post
                ? `"${post.titlePost}" via /r/${post.subreddit} at ${getFormattedDate(new Date(parseInt(post.postedAt) * 1000))}`
                : '',
            )
            .join('\n\n');
          this.handleSubmitTextReaction({
            title: 'New upvoted posts on Reddit',
            text: posts,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_LINK) {
          for (const post of newUpvotedPosts) {
            this.handleSubmitLinkReaction({
              title: 'New upvoted post on Reddit',
              text: `"${post.titlePost}" via /r/${post.subreddit} at ${getFormattedDate(new Date(parseInt(post.postedAt) * 1000))}`,
              reaction: args.reaction,
              reactionParams: args.reactionParams,
              ownerId: args.ownerId,
              url: post.postURL,
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
          const posts = newUpvotedPosts
            .map((post: NewSavedPost) =>
              post
                ? `"${post.titlePost}" via /r/${post.subreddit} at ${getFormattedDate(new Date(parseInt(post.postedAt) * 1000))} reddit.com${post.postURL}`
                : '',
            )
            .join('\n');
          this.handleCreateIssueReaction({
            title: 'New upvoted posts on Reddit',
            body: posts,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.GITHUB_CREATE_ISSUE_COMMENT) {
          for (const post of newUpvotedPosts) {
            this.handleCreateIssueCommentReaction({
              body: `New upvoted post on Reddit ${post.titlePost} (${post.postURL})`,
              reaction: args.reaction,
              reactionParams: args.reactionParams,
              ownerId: args.ownerId,
            });
          }
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_BLOCK) {
          for (const post of newUpvotedPosts) {
            this.handleUpdateBlock({
              text: `New upvoted post on Reddit ${post.titlePost} (${post.postURL})`,
              reaction: args.reaction,
              reactionParams: args.reactionParams,
              ownerId: args.ownerId,
            });
          }
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_COMMENT) {
          for (const post of newUpvotedPosts) {
            this.handleNewComment({
              text: `New upvoted post on Reddit ${post.titlePost} (${post.postURL})`,
              reaction: args.reaction,
              reactionParams: args.reactionParams,
              ownerId: args.ownerId,
            });
          }
        }
        if (args.reaction == REACTION.NOTION_UPDATE_BLOCK) {
          for (const post of newUpvotedPosts) {
            this.handleUpdateBlock({
              text: `New upvoted post on Reddit ${post.titlePost} (${post.postURL})`,
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

  @OnEvent(ACTION.REDDIT_NEW_DOWNVOTED_POST)
  async checkNewDownvotedPosts(args: Omit<AreaParams, 'action'>) {
    try {
      const newDownvotedPosts = (
        await this.appService.checkUserDownvotedPosts({})
      ).newUpDownvotedPosts;
      Logger.log('Check new downvoted posts on Reddit...');
      Logger.debug('NEW DOWNVOTED POSTS', newDownvotedPosts);
      if (newDownvotedPosts && newDownvotedPosts.length > 0) {
        Logger.log('New upvoted posts on Reddit');
        if (
          args.reaction == REACTION.GMAIL_SEND_EMAIL ||
          args.reaction == REACTION.GMAIL_SEND_EMAIL_TO_YOURSELF
        ) {
          const posts = newDownvotedPosts
            .map((post: NewSavedPost) =>
              post
                ? `${post.titlePost} via /r/${post.subreddit} at ${getFormattedDate(new Date(parseInt(post.postedAt) * 1000))} reddit.com${post.postURL}`
                : '',
            )
            .join('\n');
          const body = `You recently downvoted the following posts:\n${posts}\n\n`;
          this.handleEmailReaction({
            body,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_TEXT) {
          const posts = newDownvotedPosts
            .map((post: NewSavedPost) =>
              post
                ? `"${post.titlePost}" via /r/${post.subreddit} at ${getFormattedDate(new Date(parseInt(post.postedAt) * 1000))}`
                : '',
            )
            .join('\n\n');
          this.handleSubmitTextReaction({
            title: 'New downvoted posts on Reddit',
            text: posts,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_LINK) {
          for (const post of newDownvotedPosts) {
            this.handleSubmitLinkReaction({
              title: 'New downvoted post on Reddit',
              text: `"${post.titlePost}" via /r/${post.subreddit} at ${getFormattedDate(new Date(parseInt(post.postedAt) * 1000))}`,
              reaction: args.reaction,
              reactionParams: args.reactionParams,
              ownerId: args.ownerId,
              url: post.postURL,
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
          const posts = newDownvotedPosts
            .map((post: NewSavedPost) =>
              post
                ? `"${post.titlePost}" via /r/${post.subreddit} at ${getFormattedDate(new Date(parseInt(post.postedAt) * 1000))} reddit.com${post.postURL}`
                : '',
            )
            .join('\n');
          this.handleCreateIssueReaction({
            title: 'New downvoted posts on Reddit',
            body: posts,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.GITHUB_CREATE_ISSUE_COMMENT) {
          for (const post of newDownvotedPosts) {
            this.handleCreateIssueCommentReaction({
              body: `New downvoted post on Reddit ${post.titlePost} (${post.postURL})`,
              reaction: args.reaction,
              reactionParams: args.reactionParams,
              ownerId: args.ownerId,
            });
          }
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_BLOCK) {
          for (const post of newDownvotedPosts) {
            this.handleUpdateBlock({
              text: `New downvoted post on Reddit ${post.titlePost} (${post.postURL})`,
              reaction: args.reaction,
              reactionParams: args.reactionParams,
              ownerId: args.ownerId,
            });
          }
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_COMMENT) {
          for (const post of newDownvotedPosts) {
            this.handleNewComment({
              text: `New downvoted post on Reddit ${post.titlePost} (${post.postURL})`,
              reaction: args.reaction,
              reactionParams: args.reactionParams,
              ownerId: args.ownerId,
            });
          }
        }
        if (args.reaction == REACTION.NOTION_UPDATE_BLOCK) {
          for (const post of newDownvotedPosts) {
            this.handleUpdateBlock({
              text: `New downvoted post on Reddit ${post.titlePost} (${post.postURL})`,
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

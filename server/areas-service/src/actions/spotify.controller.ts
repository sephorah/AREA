import { Controller, Inject, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {
  AreaParams,
  HandleCreateIssue,
  HandleCreateIssueComment,
  HandleEmailReactionParams,
  HandleSubmitLink,
  HandleSubmitText,
  NewSavedAlbum,
  NewSavedShow,
  NewSavedTrack,
} from 'src/protos/interfaces';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { AppService } from 'src/app.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ACTION, REACTION } from 'src/avaliable-areas';
import { getFormattedDate } from 'src/utils';

@Controller('')
export class SpotifyActionsController {
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
      subject: 'Spotify via AREA',
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

  @OnEvent(ACTION.SPOTIFY_NEW_TRACK_SAVED)
  async checkNewSavedTracks(args: Omit<AreaParams, 'action'>) {
    try {
      const newSavedTracks = (await this.appService.checkUserSavedTracks({}))
        .newSavedTracks;
      Logger.log('Check new saved tracks on Spotify...');
      // Logger.debug('NEW SAVED TARCKS', newSavedTracks);
      if (newSavedTracks && newSavedTracks.length > 0) {
        Logger.log('New saved tracks on Spotify');
        if (
          args.reaction == REACTION.GMAIL_SEND_EMAIL ||
          args.reaction == REACTION.GMAIL_SEND_EMAIL_TO_YOURSELF
        ) {
          const songs = newSavedTracks
            .map((track: NewSavedTrack) =>
              track
                ? `${track.trackName} - ${track.artistName} (${track.albumName}) ${track.trackURL}`
                : '',
            )
            .join('\n');
          const body = `You recently saved the following songs:\n${songs}\n\n`;
          this.handleEmailReaction({
            body,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_TEXT) {
          const songs = newSavedTracks
            .map((track: NewSavedTrack) =>
              track
                ? `${track.trackName} - ${track.artistName} (${track.albumName})`
                : '',
            )
            .join('\n\n');
          // Logger.debug('HEYYYOO', args);
          this.handleSubmitTextReaction({
            title: 'New saved tracks on Spotify',
            text: songs,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_LINK) {
          for (const track of newSavedTracks) {
            this.handleSubmitLinkReaction({
              title: 'New saved track',
              text: `${track.trackName} - ${track.artistName} (${track.albumName})`,
              reaction: args.reaction,
              reactionParams: args.reactionParams,
              ownerId: args.ownerId,
              url: track.trackURL,
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
          const songs = newSavedTracks
            .map((track: NewSavedTrack) =>
              track
                ? `${track.trackName} - ${track.artistName} (${track.albumName}) ${track.trackURL}`
                : '',
            )
            .join('\n');
          this.handleCreateIssueReaction({
            title: 'New saved tracks on Spotify',
            body: songs,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.GITHUB_CREATE_ISSUE_COMMENT) {
          for (const track of newSavedTracks) {
            this.handleCreateIssueCommentReaction({
              body: `New saved track on Spotify ${track.trackName} (${track.trackURL})`,
              reaction: args.reaction,
              reactionParams: args.reactionParams,
              ownerId: args.ownerId,
            });
          }
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_BLOCK) {
          for (const track of newSavedTracks) {
            this.handleUpdateBlock({
              text: `New saved track on Spotify ${track.trackName} (${track.trackURL})`,
              reaction: args.reaction,
              reactionParams: args.reactionParams,
              ownerId: args.ownerId,
            });
          }
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_COMMENT) {
          for (const track of newSavedTracks) {
            this.handleNewComment({
              text: `New saved track on Spotify ${track.trackName} (${track.trackURL})`,
              reaction: args.reaction,
              reactionParams: args.reactionParams,
              ownerId: args.ownerId,
            });
          }
        }
        if (args.reaction == REACTION.NOTION_UPDATE_BLOCK) {
          for (const track of newSavedTracks) {
            this.handleUpdateBlock({
              text: `New saved track on Spotify ${track.trackName} (${track.trackURL})`,
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

  @OnEvent(ACTION.SPOTIFY_NEW_SHOW_SAVED)
  async checkNewSavedShows(args: Omit<AreaParams, 'action'>) {
    try {
      const newSavedShows = (await this.appService.checkUserSavedShows({}))
        .newSavedShows;
      Logger.log('Check new saved shows on Spotify...');
      Logger.debug('NEW SAVED SHOWS', newSavedShows);
      if (newSavedShows && newSavedShows.length > 0) {
        Logger.log('New saved shows on Spotify');
        if (
          args.reaction == REACTION.GMAIL_SEND_EMAIL ||
          args.reaction == REACTION.GMAIL_SEND_EMAIL_TO_YOURSELF
        ) {
          const shows = newSavedShows
            .map((show: NewSavedShow) =>
              show
                ? `${show.name} by ${show.publisher} saved at ${getFormattedDate(new Date(show.savedAt))} ${show.url}`
                : '',
            )
            .join('\n');
          const body = `You recently saved the following shows:\n${shows}\n\n`;
          this.handleEmailReaction({
            body,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_TEXT) {
          const shows = newSavedShows
            .map((show: NewSavedShow) =>
              show
                ? `${show.name} by ${show.publisher} saved at ${getFormattedDate(new Date(show.savedAt))} ${show.url}`
                : '',
            )
            .join('\n\n');
          this.handleSubmitTextReaction({
            title: 'New saved shows on Spotify',
            text: shows,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_LINK) {
          for (const show of newSavedShows) {
            this.handleSubmitLinkReaction({
              title: 'New saved show',
              text: `${show.name} by ${show.publisher} saved at ${getFormattedDate(new Date(show.savedAt))}\n\nDescription:\n\n\"${show.description}\"`,
              reaction: args.reaction,
              reactionParams: args.reactionParams,
              ownerId: args.ownerId,
              url: show.url,
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
          const shows = newSavedShows
            .map((show: NewSavedShow) =>
              show
                ? `${show.name} by ${show.publisher} saved at ${getFormattedDate(new Date(show.savedAt))} ${show.url}`
                : '',
            )
            .join('\n');
          this.handleCreateIssueReaction({
            title: 'New saved shows on Spotify',
            body: shows,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.GITHUB_CREATE_ISSUE_COMMENT) {
          for (const show of newSavedShows) {
            this.handleCreateIssueCommentReaction({
              body: `New saved show on Spotify ${show.name} (${show.url})`,
              reaction: args.reaction,
              reactionParams: args.reactionParams,
              ownerId: args.ownerId,
            });
          }
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_BLOCK) {
          for (const show of newSavedShows) {
            this.handleUpdateBlock({
              text: `New saved show on Spotify ${show.name} (${show.url})`,
              reaction: args.reaction,
              reactionParams: args.reactionParams,
              ownerId: args.ownerId,
            });
          }
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_COMMENT) {
          for (const show of newSavedShows) {
            this.handleNewComment({
              text: `New saved show on Spotify ${show.name} (${show.url})`,
              reaction: args.reaction,
              reactionParams: args.reactionParams,
              ownerId: args.ownerId,
            });
          }
        }
        if (args.reaction == REACTION.NOTION_UPDATE_BLOCK) {
          for (const show of newSavedShows) {
            this.handleUpdateBlock({
              text: `New saved show on Spotify ${show.name} (${show.url})`,
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

  @OnEvent(ACTION.SPOTIFY_NEW_ALBUM_SAVED)
  async checkNewSavedAlbums(args: Omit<AreaParams, 'action'>) {
    try {
      const newSavedAlbums = (await this.appService.checkUserSavedAlbums({}))
        .newSavedAlbums;
      Logger.log('Check new saved albums on Spotify...');
      Logger.debug('NEW SAVED ALBUMS', newSavedAlbums);
      if (newSavedAlbums && newSavedAlbums.length > 0) {
        Logger.log('New saved albums on Spotify');
        if (
          args.reaction == REACTION.GMAIL_SEND_EMAIL ||
          args.reaction == REACTION.GMAIL_SEND_EMAIL_TO_YOURSELF
        ) {
          const albums = newSavedAlbums
            .map((album: NewSavedAlbum) =>
              album ? `${album.name} - ${album.artists} ${album.url}` : '',
            )
            .join('\n');
          const body = `You recently saved the following albums:\n${albums}\n\n`;
          this.handleEmailReaction({
            body,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_TEXT) {
          const albums = newSavedAlbums
            .map((album: NewSavedAlbum) =>
              album ? `${album.name} - ${album.artists} ${album.url}` : '',
            )
            .join('\n\n');
          this.handleSubmitTextReaction({
            title: 'New saved albums on Spotify',
            text: albums,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_LINK) {
          for (const album of newSavedAlbums) {
            this.handleSubmitLinkReaction({
              title: 'New saved album',
              text: `${album.name} - ${album.artists} ${album.url}`,
              reaction: args.reaction,
              reactionParams: args.reactionParams,
              ownerId: args.ownerId,
              url: album.url,
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
          const albums = newSavedAlbums
            .map((album: NewSavedAlbum) =>
              album ? `${album.name} - ${album.artists} ${album.url}` : '',
            )
            .join('\n');
          this.handleCreateIssueReaction({
            title: 'New saved albums on Spotify',
            body: albums,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.GITHUB_CREATE_ISSUE_COMMENT) {
          for (const album of newSavedAlbums) {
            this.handleCreateIssueCommentReaction({
              body: `New saved album on Spotify ${album.name} (${album.url})`,
              reaction: args.reaction,
              reactionParams: args.reactionParams,
              ownerId: args.ownerId,
            });
          }
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_BLOCK) {
          for (const album of newSavedAlbums) {
            this.handleUpdateBlock({
              text: `New saved album on Spotify ${album.name} (${album.url})`,
              reaction: args.reaction,
              reactionParams: args.reactionParams,
              ownerId: args.ownerId,
            });
          }
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_COMMENT) {
          for (const album of newSavedAlbums) {
            this.handleNewComment({
              text: `New saved album on Spotify ${album.name} (${album.url})`,
              reaction: args.reaction,
              reactionParams: args.reactionParams,
              ownerId: args.ownerId,
            });
          }
        }
        if (args.reaction == REACTION.NOTION_UPDATE_BLOCK) {
          for (const album of newSavedAlbums) {
            this.handleUpdateBlock({
              text: `New saved album on Spotify ${album.name} (${album.url})`,
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

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
export class DiscordController {

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
      subject: 'Discord via AREA',
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
    ownerId,
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

  @OnEvent(ACTION.DISCORD_GET_GUILDS_INFO)
  async checkTime(args: Omit<AreaParams, 'action'>) {
    try {
      const guilds_to_search = JSON.parse(args.actionParams).guild;
      const listOfRoles = await this.appService.getGuildsInfo({ name: guilds_to_search });
      const oldNumberOfRoles = await this.cacheManager.get('nbrOfRolesDiscord');
      const newNumberOfRoles = listOfRoles.roles.length.toString();

      if (oldNumberOfRoles === null) {
        this.cacheManager.set('nbrOfRolesDiscord', newNumberOfRoles);
        return;
      }

      if (oldNumberOfRoles !== newNumberOfRoles) {
        this.cacheManager.set('nbrOfRolesDiscord', newNumberOfRoles)
        if (
          args.reaction == REACTION.GMAIL_SEND_EMAIL ||
          args.reaction == REACTION.GMAIL_SEND_EMAIL_TO_YOURSELF
        ) {
          const body = `Your roles changed in ${guilds_to_search} server !\n`;
          this.handleEmailReaction({
            body,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_TEXT) {

          this.handleSubmitTextReaction({
            title: `Role changed in ${guilds_to_search}`,
            text: `Your roles changed in ${guilds_to_search} server !\n`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_LINK) {
          this.handleSubmitLinkReaction({
            title: `Role changed in ${guilds_to_search}`,
            text: `Your roles changed in ${guilds_to_search} server !\n`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
            url: '',
          });
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_BLOCK) {
          this.handleUpdateBlock({
            text: `Your roles changed in ${guilds_to_search} server !\n`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId
          })
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_COMMENT) {
          this.handleNewComment({
            text: `Your roles changed in ${guilds_to_search} server !\n`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId
          })
        }
        if (args.reaction == REACTION.NOTION_UPDATE_BLOCK) {
          this.handleUpdateBlock({
            text: `Your roles changed in ${guilds_to_search} server !\n`,
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
            title: `Role changed in ${guilds_to_search}`,
            body: `Your roles changed in ${guilds_to_search} server !\n`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.GITHUB_CREATE_ISSUE_COMMENT) {
          this.handleCreateIssueCommentReaction({
            body: `Your roles changed in ${guilds_to_search} server !\n`,
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

  @OnEvent(ACTION.DISCORD_USERNAME_CHANGED)
  async checkUsernameChange(args: Omit<AreaParams, 'action'>) {
    try {
      const getUsername = await this.appService.getDiscordUsername();
      const oldUsername = await this.cacheManager.get('usernameDiscord');
      const newUsername = getUsername.username;

      if (oldUsername === null) {
        this.cacheManager.set('usernameDiscord', newUsername);
        return;
      }

      if (oldUsername !== newUsername) {
        this.cacheManager.set('usernameDiscord', newUsername);
        if (
          args.reaction == REACTION.GMAIL_SEND_EMAIL ||
          args.reaction == REACTION.GMAIL_SEND_EMAIL_TO_YOURSELF
        ) {
          const body = `The discord username been updated ! New username : ${newUsername}\n`;
          this.handleEmailReaction({
            body,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_TEXT) {

          this.handleSubmitTextReaction({
            title: `Discord username changed`,
            text: `The discord username been updated ! New username : ${newUsername}\n`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_LINK) {
          this.handleSubmitLinkReaction({
            title: `Discord username changed`,
            text: `The discord username been updated ! New username : ${newUsername}\n`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
            url: '',
          });
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_BLOCK) {
          this.handleUpdateBlock({
            text: `The discord username been updated ! New username : ${newUsername}\n`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId
          })
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_COMMENT) {
          this.handleNewComment({
            text: `The discord username been updated ! New username : ${newUsername}\n`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId
          })
        }
        if (args.reaction == REACTION.NOTION_UPDATE_BLOCK) {
          this.handleUpdateBlock({
            text: `The discord username been updated ! New username : ${newUsername}\n`,
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
            title: `Discord username changed`,
            body: `The discord username been updated ! New username : ${newUsername}\n`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.GITHUB_CREATE_ISSUE_COMMENT) {
          this.handleCreateIssueCommentReaction({
            body: `The discord username been updated ! New username : ${newUsername}\n`,
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

  @OnEvent(ACTION.DISCORD_NEW_SERVICE)
  async checkNewService(args: Omit<AreaParams, 'action'>) {
    try {
      const getServices = await this.appService.getDiscordConnectedServices();
      const oldServices = await this.cacheManager.get('nbrOfServicesDiscord');
      const newServices = getServices.listOfServices.length.toString();
      const lastService = getServices.listOfServices[0];

      if (oldServices === null) {
        this.cacheManager.set('nbrOfServicesDiscord', newServices);
        return;
      }

      if (oldServices !== newServices) {
        this.cacheManager.set('nbrOfServicesDiscord', newServices);

        if (
          args.reaction == REACTION.GMAIL_SEND_EMAIL ||
          args.reaction == REACTION.GMAIL_SEND_EMAIL_TO_YOURSELF
        ) {
          const body = `Discord connection service updated ! New service : ${lastService}\n`;
          this.handleEmailReaction({
            body,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_TEXT) {

          this.handleSubmitTextReaction({
            title: `Discord service updated`,
            text: `Discord connection service updated ! New service : ${lastService}\n`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_LINK) {
          this.handleSubmitLinkReaction({
            title: `Discord service updated`,
            text: `Discord connection service updated ! New service : ${lastService}\n`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
            url: '',
          });
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_BLOCK) {
          this.handleUpdateBlock({
            text: `Discord connection service updated ! New service : ${lastService}\n`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId
          })
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_COMMENT) {
          this.handleNewComment({
            text: `Discord connection service updated ! New service : ${lastService}\n`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId
          })
        }
        if (args.reaction == REACTION.NOTION_UPDATE_BLOCK) {
          this.handleUpdateBlock({
            text: `Discord connection service updated ! New service : ${lastService}\n`,
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
            title: `Discord service updated`,
            body: `Discord connection service updated ! New service : ${lastService}\n`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.GITHUB_CREATE_ISSUE_COMMENT) {
          this.handleCreateIssueCommentReaction({
            body: `Discord connection service updated ! New service : ${lastService}\n`,
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

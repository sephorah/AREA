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
export class NotionTriggersController {

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

  @OnEvent(ACTION.NOTION_NAME_CHANGED)
  async checkNewNameUser(args: Omit<AreaParams, 'action'>) {
    try {
      const getNameUser = await this.appService.notionGetNameUser();
      const oldName = await this.cacheManager.get('notionNameUser');
      const newName = getNameUser.name

      if (oldName === null) {
        this.cacheManager.set('notionNameUser', newName);
        return;
      }
      if (oldName !== newName) {
        this.cacheManager.set('notionNameUser', newName);
        if (
          args.reaction == REACTION.GMAIL_SEND_EMAIL ||
          args.reaction == REACTION.GMAIL_SEND_EMAIL_TO_YOURSELF
        ) {
          const body = `Your Notion name change ! New name : ${newName}`;
          this.handleEmailReaction({
            body,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_TEXT) {
          this.handleSubmitTextReaction({
            title: 'Notion name changed',
            text: `Your Notion name change ! New name : ${newName}`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_LINK) {
          this.handleSubmitLinkReaction({
            title: 'Notion name changed',
            text: `Your Notion name change ! New name : ${newName}`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
            url: '',
          });
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_BLOCK) {
          this.handleUpdateBlock({
            text: `Your Notion name change ! New name : ${newName}`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId
          })
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_COMMENT) {
          this.handleNewComment({
            text: `Your Notion name change ! New name : ${newName}`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId       
          })
        }
        if (args.reaction == REACTION.NOTION_UPDATE_BLOCK) {
          this.handleUpdateBlock({
            text: `Your Notion name change ! New name : ${newName}`,
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
            title: 'Notion name changed',
            body: `Your Notion name change ! New name : ${newName}`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.GITHUB_CREATE_ISSUE_COMMENT) {
          this.handleCreateIssueCommentReaction({
            body: `Your Notion name change ! New name : ${newName}`,
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

  @OnEvent(ACTION.NOTION_EMAIL_CHANGED)
  async checkNewEmailUser(args: Omit<AreaParams, 'action'>) {
    try {
      const getEmailUser = await this.appService.notionGetEmailUser();
      const oldEmail = await this.cacheManager.get('notionEmailUser');
      const newEmail = getEmailUser.email;

      if (oldEmail === null) {
        this.cacheManager.set('notionEmailUser', newEmail);
        return;
      }
      if (oldEmail !== newEmail) {
        this.cacheManager.set('notionEmailUser', newEmail);
        if (
          args.reaction == REACTION.GMAIL_SEND_EMAIL ||
          args.reaction == REACTION.GMAIL_SEND_EMAIL_TO_YOURSELF
        ) {
          const body = `Your Notion Email change ! New Email : ${newEmail}`;
          this.handleEmailReaction({
            body,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_TEXT) {
          this.handleSubmitTextReaction({
            title: 'Notion email changed',
            text: `Your Notion Email change ! New Email : ${newEmail}`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_LINK) {
          this.handleSubmitLinkReaction({
            title: 'Notion email changed',
            text: `Your Notion Email change ! New Email : ${newEmail}`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
            url: '',
          });
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_BLOCK) {
          this.handleUpdateBlock({
            text: `Your Notion Email change ! New Email : ${newEmail}`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId
          })
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_COMMENT) {
          this.handleNewComment({
            text: `Your Notion Email change ! New Email : ${newEmail}`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId       
          })
        }
        if (args.reaction == REACTION.NOTION_UPDATE_BLOCK) {
          this.handleUpdateBlock({
            text: `Your Notion Email change ! New Email : ${newEmail}`,
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
            title: 'Notion email changed',
            body: `Your Notion Email change ! New Email : ${newEmail}`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.GITHUB_CREATE_ISSUE_COMMENT) {
          this.handleCreateIssueCommentReaction({
            body: `Your Notion Email change ! New Email : ${newEmail}`,
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

  @OnEvent(ACTION.NOTION_OWNER_NAME_CHANGED)
  async checkOwnerNameChange(args: Omit<AreaParams, 'action'>) {
    try {
      const getOwnerName = await this.appService.notionGetNameUser();
      const oldOwnerName = await this.cacheManager.get('notionOwnerName');
      const newOwnerName = getOwnerName.name

      if (oldOwnerName === null) {
        this.cacheManager.set('notionOwnerName', newOwnerName);
        return;
      }
      if (oldOwnerName !== newOwnerName) {
        this.cacheManager.set('notionOwnerName', newOwnerName);
        if (
          args.reaction == REACTION.GMAIL_SEND_EMAIL ||
          args.reaction == REACTION.GMAIL_SEND_EMAIL_TO_YOURSELF
        ) {
          const body = `The name of the owner of the Notion\'s bot changed ! New name : ${newOwnerName}`;
          this.handleEmailReaction({
            body,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_TEXT) {
          this.handleSubmitTextReaction({
            title: 'Notion\'s bot owner name changed',
            text: `The name of the owner of the Notion\'s bot changed ! New name : ${newOwnerName}`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_LINK) {
          this.handleSubmitLinkReaction({
            title: 'Notion\'s bot owner name changed',
            text: `The name of the owner of the Notion\'s bot changed ! New name : ${newOwnerName}`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
            url: '',
          });
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_BLOCK) {
          this.handleUpdateBlock({
            text: `The name of the owner of the Notion\'s bot changed ! New name : ${newOwnerName}`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId
          })
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_COMMENT) {
          this.handleNewComment({
            text: `The name of the owner of the Notion\'s bot changed ! New name : ${newOwnerName}`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId       
          })
        }
        if (args.reaction == REACTION.NOTION_UPDATE_BLOCK) {
          this.handleUpdateBlock({
            text: `The name of the owner of the Notion\'s bot changed ! New name : ${newOwnerName}`,
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
            title: 'Notion\'s bot owner name changed',
            body: `The name of the owner of the Notion\'s bot changed ! New name : ${newOwnerName}`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.GITHUB_CREATE_ISSUE_COMMENT) {
          this.handleCreateIssueCommentReaction({
            body: `The name of the owner of the Notion\'s bot changed ! New name : ${newOwnerName}`,
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

  @OnEvent(ACTION.NOTION_BLOCK_LAST_EDITED)
  async checkLastEditedBlock(args: Omit<AreaParams, 'action'>) {
    try {
      const blockId: string = JSON.parse(args.actionParams).blockId;
      const getLastEdited = await this.appService.notionGetLastEditedBlock({ blockId: blockId });
      const oldTime = await this.cacheManager.get('notionLastEditedBlock');
      const newTime = getLastEdited

      if (oldTime === null) {
        this.cacheManager.set('notionLastEditedBlock', newTime.date);
        return;
      }
      if (oldTime !== newTime.date) {
        this.cacheManager.set('notionLastEditedBlock', newTime.date);
        if (
          args.reaction == REACTION.GMAIL_SEND_EMAIL ||
          args.reaction == REACTION.GMAIL_SEND_EMAIL_TO_YOURSELF
        ) {
          const body = `The block has been edited ! It has been edited by ${newTime.editorsName}`;
          this.handleEmailReaction({
            body,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_TEXT) {
          this.handleSubmitTextReaction({
            title: `Notion block edited by ${newTime.editorsName}`,
            text: `The block has been edited ! It has been edited by ${newTime.editorsName}`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_LINK) {
          this.handleSubmitLinkReaction({
            title: `Notion block edited by ${newTime.editorsName}`,
            text: `The block has been edited ! It has been edited by ${newTime.editorsName}`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
            url: '',
          });
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_BLOCK) {
          this.handleUpdateBlock({
            text: `The block has been edited ! It has been edited by ${newTime.editorsName}`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId
          })
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_COMMENT) {
          this.handleNewComment({
            text: `The block has been edited ! It has been edited by ${newTime.editorsName}`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId       
          })
        }
        if (args.reaction == REACTION.NOTION_UPDATE_BLOCK) {
          this.handleUpdateBlock({
            text: `The block has been edited ! It has been edited by ${newTime.editorsName}`,
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
            title: `Notion block edited by ${newTime.editorsName}`,
            body: `The block has been edited ! It has been edited by ${newTime.editorsName}`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.GITHUB_CREATE_ISSUE_COMMENT) {
          this.handleCreateIssueCommentReaction({
            body: `The block has been edited ! It has been edited by ${newTime.editorsName}`,
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

  @OnEvent(ACTION.NOTION_CHILDREN_BLOCK)
  async checkChildrenBlock(args: Omit<AreaParams, 'action'>) {
    try {
      const blockId: string = JSON.parse(args.actionParams).blockId;
      const getChildren = await this.appService.notionGetChildrenBlock({ blockId: blockId });
      const oldChildrenNbr = await this.cacheManager.get('notionChildrenNbr');
      const newChildren = getChildren;

      if (oldChildrenNbr === null) {
        this.cacheManager.set('notionChildrenNbr', newChildren.childrenNbr);
        return;
      }
      if (oldChildrenNbr !== newChildren.childrenNbr) {
        this.cacheManager.set('notionChildrenNbr', newChildren.childrenNbr);
        if (
          args.reaction == REACTION.GMAIL_SEND_EMAIL ||
          args.reaction == REACTION.GMAIL_SEND_EMAIL_TO_YOURSELF
        ) {
          const body = `${newChildren.editorsName} has added a new block`;
          this.handleEmailReaction({
            body,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_TEXT) {

          this.handleSubmitTextReaction({
            title: `New block added by ${newChildren.editorsName}`,
            text: `${newChildren.editorsName} has added a new block`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_LINK) {
          this.handleSubmitLinkReaction({
            title: `New block added by ${newChildren.editorsName}`,
            text: `${newChildren.editorsName} has added a new block`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
            url: '',
          });
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_BLOCK) {
          this.handleUpdateBlock({
            text: `${newChildren.editorsName} has added a new block`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId
          })
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_COMMENT) {
          this.handleNewComment({
            text: `${newChildren.editorsName} has added a new block`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId       
          })
        }
        if (args.reaction == REACTION.NOTION_UPDATE_BLOCK) {
          this.handleUpdateBlock({
            text: `${newChildren.editorsName} has added a new block`,
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
            title: `New block added by ${newChildren.editorsName}`,
            body: `${newChildren.editorsName} has added a new block`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.GITHUB_CREATE_ISSUE_COMMENT) {
          this.handleCreateIssueCommentReaction({
            body: `${newChildren.editorsName} has added a new block`,
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

  @OnEvent(ACTION.NOTION_PAGE_LAST_EDITED)
  async checkLastEditedPage(args: Omit<AreaParams, 'action'>) {
    try {
      const pageId: string = JSON.parse(args.actionParams).pageId;
      const getLastEdited = await this.appService.notionGetLastEditedPage({ pageId: pageId });
      const oldTime = await this.cacheManager.get('notionLastEditedPage');
      const newTime = getLastEdited

      if (oldTime === null) {
        this.cacheManager.set('notionLastEditedPage', newTime.date);
        return;
      }
      if (oldTime !== newTime.date) {
        this.cacheManager.set('notionLastEditedPage', newTime.date);
        if (
          args.reaction == REACTION.GMAIL_SEND_EMAIL ||
          args.reaction == REACTION.GMAIL_SEND_EMAIL_TO_YOURSELF
        ) {
          const body = `The page has been edited ! It has been edited by ${newTime.editorsName}`;
          this.handleEmailReaction({
            body,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_TEXT) {
          this.handleSubmitTextReaction({
            title: `Page edited by ${newTime.editorsName}`,
            text: `The page has been edited ! It has been edited by ${newTime.editorsName}`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_LINK) {
          this.handleSubmitLinkReaction({
            title: `Page edited by ${newTime.editorsName}`,
            text: `The page has been edited ! It has been edited by ${newTime.editorsName}`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
            url: '',
          });
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_BLOCK) {
          this.handleUpdateBlock({
            text: `The page has been edited ! It has been edited by ${newTime.editorsName}`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId
          })
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_COMMENT) {
          this.handleNewComment({
            text: `The page has been edited ! It has been edited by ${newTime.editorsName}`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId       
          })
        }
        if (args.reaction == REACTION.NOTION_UPDATE_BLOCK) {
          this.handleUpdateBlock({
            text: `The page has been edited ! It has been edited by ${newTime.editorsName}`,
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
            title: `Page edited by ${newTime.editorsName}`,
            body: `The page has been edited ! It has been edited by ${newTime.editorsName}`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.GITHUB_CREATE_ISSUE_COMMENT) {
          this.handleCreateIssueCommentReaction({
            body: `The page has been edited ! It has been edited by ${newTime.editorsName}`,
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

  @OnEvent(ACTION.NOTION_DATABASE_LAST_EDITED)
  async checkLastEditedDatabase(args: Omit<AreaParams, 'action'>) {
    try {
      const databaseId: string = JSON.parse(args.actionParams).databaseId;
      const getLastEdited = await this.appService.notionGetLastEditedDatabase({ databaseId: databaseId });
      const oldTime = await this.cacheManager.get('notionLastEditedDatabase');
      const newTime = getLastEdited

      if (oldTime === null) {
        this.cacheManager.set('notionLastEditedDatabase', newTime.date);
        return;
      }
      if (oldTime !== newTime.date) {
        this.cacheManager.set('notionLastEditedDatabase', newTime.date);
        if (
          args.reaction == REACTION.GMAIL_SEND_EMAIL ||
          args.reaction == REACTION.GMAIL_SEND_EMAIL_TO_YOURSELF
        ) {
          const body = `The database has been edited ! It has been edited by ${newTime.editorsName}`;
          this.handleEmailReaction({
            body,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_TEXT) {

          this.handleSubmitTextReaction({
            title: `Database edited by ${newTime.editorsName}`,
            text: `The database has been edited ! It has been edited by ${newTime.editorsName}`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_LINK) {
          this.handleSubmitLinkReaction({
            title: `Database edited by ${newTime.editorsName}`,
            text: `The database has been edited ! It has been edited by ${newTime.editorsName}`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
            url: '',
          });
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_BLOCK) {
          this.handleUpdateBlock({
            text: `The database has been edited ! It has been edited by ${newTime.editorsName}`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId
          })
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_COMMENT) {
          this.handleNewComment({
            text: `The database has been edited ! It has been edited by ${newTime.editorsName}`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId       
          })
        }
        if (args.reaction == REACTION.NOTION_UPDATE_BLOCK) {
          this.handleUpdateBlock({
            text: `The database has been edited ! It has been edited by ${newTime.editorsName}`,
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
            title: `Database edited by ${newTime.editorsName}`,
            body: `The database has been edited ! It has been edited by ${newTime.editorsName}`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.GITHUB_CREATE_ISSUE_COMMENT) {
          this.handleCreateIssueCommentReaction({
            body: `The database has been edited ! It has been edited by ${newTime.editorsName}`,
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

  @OnEvent(ACTION.NOTION_NEW_COMMENT_ON_BLOCK)
  async checkCommentsOnBlock(args: Omit<AreaParams, 'action'>) {
    try {
      const blockId: string = JSON.parse(args.actionParams).blockId;
      const getComment = await this.appService.notionGetCommentsOnBlock({ blockId: blockId });
      const oldNbrOfComment = await this.cacheManager.get('notionNbrOfComments');
      const newNbrOfComment = getComment.nbrOfComments;

      if (oldNbrOfComment === null) {
        this.cacheManager.set('notionNbrOfComments', newNbrOfComment);
        return;
      }
      if (oldNbrOfComment !== newNbrOfComment) {
        this.cacheManager.set('notionNbrOfComments', newNbrOfComment);
        if (
          args.reaction == REACTION.GMAIL_SEND_EMAIL ||
          args.reaction == REACTION.GMAIL_SEND_EMAIL_TO_YOURSELF
        ) {
          const body = `A comment has been added on block ${getComment.blockId} !`;
          this.handleEmailReaction({
            body,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_TEXT) {

          this.handleSubmitTextReaction({
            title: `Notion new comment added`,
            text: `A comment has been added on block ${getComment.blockId} !`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.REDDIT_SUBMIT_LINK) {
          this.handleSubmitLinkReaction({
            title: `Notion new comment added`,
            text: `A comment has been added on block ${getComment.blockId} !`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
            url: '',
          });
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_BLOCK) {
          this.handleUpdateBlock({
            text: `A comment has been added on block ${getComment.blockId} !`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId
          })
        }
        if (args.reaction == REACTION.NOTION_POST_NEW_COMMENT) {
          this.handleNewComment({
            text: `A comment has been added on block ${getComment.blockId} !`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId       
          })
        }
        if (args.reaction == REACTION.NOTION_UPDATE_BLOCK) {
          this.handleUpdateBlock({
            text: `A comment has been added on block ${getComment.blockId} !`,
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
            title: `Notion new comment added`,
            body: `A comment has been added on block ${getComment.blockId} !`,
            reaction: args.reaction,
            reactionParams: args.reactionParams,
            ownerId: args.ownerId,
          });
        }
        if (args.reaction == REACTION.GITHUB_CREATE_ISSUE_COMMENT) {
          this.handleCreateIssueCommentReaction({
            body: `A comment has been added on block ${getComment.blockId} !`,
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
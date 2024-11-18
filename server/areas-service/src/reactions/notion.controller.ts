import { Controller, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { AreasService } from '../areas/areas.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { AppService } from 'src/app.service';
import { REACTION } from 'src/avaliable-areas';
import { AreaParams, ReactionParams } from 'src/protos/interfaces';

@Controller('')
export class NotionReactionsController {
  constructor(
    private readonly appService: AppService,
  ) { }

  @OnEvent(REACTION.NOTION_POST_NEW_BLOCK)
  async postNewBlock(reaction: ReactionParams) {
    const text = JSON.parse(reaction.reactionParams).text;
    const page_id = JSON.parse(reaction.reactionParams).page_id;

    try {
      await this.appService.notionPostNewBlock({ text: text, pageId: page_id })
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  @OnEvent(REACTION.NOTION_POST_NEW_COMMENT)
  async postNewComment(reaction: ReactionParams) {
    const pageId = JSON.parse(reaction.reactionParams).pageId;
    const text = JSON.parse(reaction.reactionParams).text;

    try {
      await this.appService.notionPostNewComment({ pageId: pageId, text: text })
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  @OnEvent(REACTION.NOTION_UPDATE_BLOCK)
  async updateBlock(reaction: ReactionParams) {
    const blockId = JSON.parse(reaction.reactionParams).blockId;
    const text = JSON.parse(reaction.reactionParams).text;

    try {
      await this.appService.notionUpdateBlock({ blockId: blockId, text: text })
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  @OnEvent(REACTION.NOTION_DELETE_BLOCK)
  async deleteBlock(reaction: ReactionParams) {
    const blockId = JSON.parse(reaction.reactionParams).blockId;

    try {
      await this.appService.notionDeleteBlock({ blockId: blockId })
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  @OnEvent(REACTION.NOTION_CREATE_PAGE)
  async createPage(reaction: ReactionParams) {
    const pageId = JSON.parse(reaction.reactionParams).pageId;
    const title = JSON.parse(reaction.reactionParams).title;

    try {
      await this.appService.notionCreatePage({ pageId: pageId, title: title })
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  @OnEvent(REACTION.NOTION_CREATE_DATABASE)
  async createDatabase(reaction: ReactionParams) {
    const pageId = JSON.parse(reaction.reactionParams).pageId;
    const title = JSON.parse(reaction.reactionParams).title;

    try {
      await this.appService.notionCreateDatabase({ pageId: pageId, title: title })
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  @OnEvent(REACTION.NOTION_UPDATE_DATABASE_TITLE)
  async updateDatabaseTitle(reaction: ReactionParams) {
    const databaseId = JSON.parse(reaction.reactionParams).databaseId;
    const title = JSON.parse(reaction.reactionParams).title;

    try {
      await this.appService.notionUpdateDatabaseTitle({ databaseId: databaseId, title: title })
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }
}

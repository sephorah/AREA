import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager'
import { Inject, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { RpcException } from '@nestjs/microservices';
import {
  NotionBlockId,
  NotionChildrenBlock,
  NotionCommentsInfo,
  NotionDatabaseId,
  NotionLastEditedBlock,
  NotionLastEditedDatabase,
  NotionLastEditedPage,
  NotionPageId
} from 'src/protos/interfaces';
import constants from '../constants';

@Injectable()
export class NotionTriggersService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

  async getNameUser(): Promise<string> {
    const version = constants().notionVersion;
    const url = `https://api.notion.com/v1/users`;
    const token = await this.cacheManager.get('notionToken')

    try {
      let nameUser = "";
      const usersInfos = (await axios.get(url, {
        headers: {
          Accept: "application/json",
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Notion-Version': version
        }
      })).data;
      nameUser = usersInfos.results[0].name

      return nameUser;
    } catch (error) {
      Logger.debug(error.response ? error.response.data : error.message)
      throw new RpcException(error);
    }
  }

  async getEmailUser(): Promise<string> {
    const version = constants().notionVersion;
    const token = await this.cacheManager.get('notionToken')

    try {
      const userId = (await axios.get(`https://api.notion.com/v1/users`, {
        headers: {
          Accept: "application/json",
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Notion-Version': version
        }
      })).data.results[0].id;

      const emailUser = (await axios.get(`https://api.notion.com/v1/users/${userId}`, {
        headers: {
          Accept: "application/json",
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Notion-Version': version
        }
      })).data.person.email;

      return emailUser;
    } catch (error) {
      Logger.debug(error.response ? error.response.data : error.message)
      throw new RpcException(error);
    }
  }

  async getOwnerName(): Promise<string> {
    const version = constants().notionVersion;
    const token = await this.cacheManager.get('notionToken')

    try {
      const ownerName = (await axios.get(`https://api.notion.com/v1/users/me`, {
        headers: {
          Accept: "application/json",
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Notion-Version': version
        }
      })).data.bot.owner.type.name;

      return ownerName;
    } catch (error) {
      Logger.debug(error.response ? error.response.data : error.message)
      throw new RpcException(error);
    }
  }

  async getLastEditedBlock(data: NotionBlockId): Promise<NotionLastEditedBlock> {
    const version = constants().notionVersion;
    const token = await this.cacheManager.get('notionToken')

    try {
      const blockInfo = (await axios.get(`https://api.notion.com/v1/blocks/${data.blockId}`, {
        headers: {
          Accept: "application/json",
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Notion-Version': version
        }
      })).data;
      const date = blockInfo.last_edited_time;
      const editedById = blockInfo.last_edited_by.id;

      const editorName = (await axios.get(`https://api.notion.com/v1/users/${editedById}`, {
        headers: {
          Accept: "application/json",
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Notion-Version': version
        }
      })).data.name;

      return { date: date, editorsName: editorName };
    } catch (error) {
      Logger.debug(error.response ? error.response.data : error.message)
      throw new RpcException(error);
    }
  }

  async getChildrenBlock(data: NotionBlockId): Promise<NotionChildrenBlock> {
    const version = constants().notionVersion;
    const token = await this.cacheManager.get('notionToken')

    try {
      const blockInfo = (await axios.get(`https://api.notion.com/v1/blocks/${data.blockId}/children`, {
        headers: {
          Accept: "application/json",
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Notion-Version': version
        }
      })).data;
      const editorsName = blockInfo.results;

      if (editorsName.length === 0) {
        return { editorsName: "no children", childrenNbr: "0" }
      } else {
        const name = (await axios.get(`https://api.notion.com/v1/users/${editorsName[editorsName.length - 1].last_edited_by.id}`, {
          headers: {
            Accept: "application/json",
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Notion-Version': version
          }
        })).data.name;

        return { editorsName: name, childrenNbr: editorsName.length }
      }
    } catch (error) {
      Logger.debug(error.response ? error.response.data : error.message)
      throw new RpcException(error);
    }
  }

  async getLastEditedPage(data: NotionPageId): Promise<NotionLastEditedPage> {
    const version = constants().notionVersion;
    const token = await this.cacheManager.get('notionToken')

    try {
      const pageInfo = (await axios.get(`https://api.notion.com/v1/pages/${data.pageId}`, {
        headers: {
          Accept: "application/json",
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Notion-Version': version
        }
      })).data;
      const date = pageInfo.last_edited_time;
      const editedById = pageInfo.last_edited_by.id;

      const editorName = (await axios.get(`https://api.notion.com/v1/users/${editedById}`, {
        headers: {
          Accept: "application/json",
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Notion-Version': version
        }
      })).data.name;

      return { date: date, editorsName: editorName };
    } catch (error) {
      Logger.debug(error.response ? error.response.data : error.message)
      throw new RpcException(error);
    }
  }

  async getCommentsOnBlock(data: NotionBlockId): Promise<NotionCommentsInfo> {
    const version = constants().notionVersion;
    const token = await this.cacheManager.get('notionToken')

    try {
      const comments = (await axios.get(`https://api.notion.com/v1/comments?block_id=${data.blockId}`, {
        headers: {
          Accept: "application/json",
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Notion-Version': version
        }
      })).data;

      return { nbrOfComments: comments.results.length, blockId: data.blockId };
    } catch (error) {
      Logger.debug(error.response ? error.response.data : error.message)
      throw new RpcException(error);
    }
  }

  async getLastEditedDatabase(data: NotionDatabaseId): Promise<NotionLastEditedDatabase> {
    const version = constants().notionVersion;
    const token = await this.cacheManager.get('notionToken')

    try {
      const dbInfo = (await axios.get(`https://api.notion.com/v1/databases/${data.databaseId}`, {
        headers: {
          Accept: "application/json",
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Notion-Version': version
        }
      })).data;
      const date = dbInfo.last_edited_time;
      const editedById = dbInfo.last_edited_by.id;

      const editorName = (await axios.get(`https://api.notion.com/v1/users/${editedById}`, {
        headers: {
          Accept: "application/json",
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Notion-Version': version
        }
      })).data.name;

      return { date: date, editorsName: editorName };
    } catch (error) {
      Logger.debug(error.response ? error.response.data : error.message)
      throw new RpcException(error);
    }
  }
}

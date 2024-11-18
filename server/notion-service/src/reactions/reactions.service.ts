import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager'
import { Inject, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { RpcException } from '@nestjs/microservices';
import { NotionBlockId, NotionCreatePage, NotionNewComment, NotionTitleBlock, NotionUpdateBlock, NotionUpdateDatabase } from 'src/protos/interfaces';
import constants from '../constants';

@Injectable()
export class NotionReactionsService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

  async postNewBlock({
    text,
    pageId
  }: NotionTitleBlock) {
    const version = constants().notionVersion;
    const url = `https://api.notion.com/v1/blocks/${pageId}/children`;
    const token = await this.cacheManager.get('notionToken')
    const data = {

      "children": [
        {
          "object": "block",
          "type": "paragraph",
          "paragraph": {
            "rich_text": [
              {
                "type": "text",
                "text": {
                  "content": text
                }
              }
            ]
          }
        }
      ]
    }

    try {
      await axios.patch(url, data, {
        headers: {
          Accept: "application/json",
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Notion-Version': version
        }
      });


      return;
    } catch (error) {
      Logger.debug(error.response ? error.response.data : error.message)
      throw new RpcException(error);
    }
  }

  async postNewComment({
    pageId,
    text
  }: NotionNewComment) {
    const version = constants().notionVersion;
    const url = `https://api.notion.com/v1/comments`;
    const token = await this.cacheManager.get('notionToken')
    const data = {
      "parent": {
        "page_id": pageId
      },
      "rich_text": [
        {
          "text": {
            "content": text
          }
        }
      ]
    }

    try {
      await axios.post(url, data, {
        headers: {
          Accept: "application/json",
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Notion-Version': version
        }
      });
    } catch (error) {
      Logger.debug(error.response ? error.response.data : error.message)
      throw new RpcException(error);
    }
  }

  async updateBlock({
    blockId,
    text
  }: NotionUpdateBlock) {
    const version = constants().notionVersion;
    const url = `https://api.notion.com/v1/blocks/${blockId}`;
    const token = await this.cacheManager.get('notionToken')
    const data = {
      "paragraph": {
        "rich_text": [
          {
            "text": {
              "content": text
            }
          }
        ]
      }
    }

    try {
      await axios.patch(url, data, {
        headers: {
          Accept: "application/json",
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Notion-Version': version
        }
      });
    } catch (error) {
      Logger.debug(error.response ? error.response.data : error.message)
      throw new RpcException(error);
    }
  }

  async deleteBlock({
    blockId,
  }: NotionBlockId) {
    const version = constants().notionVersion;
    const url = `https://api.notion.com/v1/blocks/${blockId}`;
    const token = await this.cacheManager.get('notionToken')

    try {
      await axios.delete(url, {
        headers: {
          Accept: "application/json",
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Notion-Version': version
        }
      });

    } catch (error) {
      Logger.debug(error.response ? error.response.data : error.message)
      throw new RpcException(error);
    }
  }

  async createPage({
    pageId,
    title
  }: NotionCreatePage) {
    const version = constants().notionVersion;
    const url = `https://api.notion.com/v1/pages`;
    const token = await this.cacheManager.get('notionToken')
    const data = {
      "parent": {
        "page_id": pageId
      },
      "properties": {
        "title": [
          {
            "text": {
              "content": title
            }
          }
        ]
      }
    }

    try {
      await axios.post(url, data, {
        headers: {
          Accept: "application/json",
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Notion-Version': version
        }
      });

    } catch (error) {
      Logger.debug(error.response ? error.response.data : error.message)
      throw new RpcException(error);
    }
  }

  async createDatabase({
    pageId,
    title
  }: NotionCreatePage) {
    const version = constants().notionVersion;
    const url = `https://api.notion.com/v1/databases`;
    const token = await this.cacheManager.get('notionToken')
    const data = {
      "parent": {
        "page_id": pageId
      },
      "title": [
        {
          "type": "text",
          "text": {
            "content": title
          }
        }
      ],
      "properties": {
        "Name": {
          "title": {}
        }
      }
    }

    try {
      await axios.post(url, data, {
        headers: {
          Accept: "application/json",
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Notion-Version': version
        }
      });

    } catch (error) {
      Logger.debug(error.response ? error.response.data : error.message)
      throw new RpcException(error);
    }
  }

  async updateDatabaseTitle({
    databaseId,
    title
  }: NotionUpdateDatabase) {
    const version = constants().notionVersion;
    const url = `https://api.notion.com/v1/databases/${databaseId}`;
    const token = await this.cacheManager.get('notionToken')
    const data = {
      "title": [
        {
          "type": "text",
          "text": {
            "content": title
          }
        }
      ],
      "description": [
        {
          "text": {
            "content": ""
          }
        }
      ]
    }

    try {
      await axios.patch(url, data, {
        headers: {
          Accept: "application/json",
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Notion-Version': version
        }
      });

    } catch (error) {
      Logger.debug(error.response ? error.response.data : error.message)
      throw new RpcException(error);
    }
  }
}

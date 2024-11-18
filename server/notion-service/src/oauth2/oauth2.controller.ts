import { Controller, Inject, Logger } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import {
  RequestAuthSent,
  RequestAccessTokenParams,
  RequestAccessTokenSent,
} from '../protos/interfaces';
import axios from 'axios';
import constants from '../constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager'

@Controller('')
export class NotionOAuth2Controller {

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  @GrpcMethod('NotionService', 'RequestAccess')
  requestAccess(): RequestAuthSent {
    const clientId = constants().notionClientId;
    const redirectUri = constants().redirectUri;
    const scope = 'email';
    const url = `https://api.notion.com/v1/oauth/authorize?client_id=${clientId}&response_type=code&owner=user&redirect_uri=${redirectUri}`;

    return { url: url };
  }

  @GrpcMethod('NotionService', 'RequestAccessToken')
  async requestAccessToken({
    code,
  }: RequestAccessTokenParams): Promise<RequestAccessTokenSent> {
    const clientId = constants().notionClientId;
    const clientSecret = constants().notionClientSecret;
    const redirectUri = constants().redirectUri;
    const url = `https://api.notion.com/v1/oauth/token`;
    const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    try {
      const data = {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      };
      
      const accessToken = (
        await axios.post(url, data, {
          headers: {
            Accept: "application/json",
            'Content-Type': 'application/json',
            'Authorization': `Basic ${encoded}`,
          }
        })
      ).data;

      await this.cacheManager.set('notionToken', accessToken.access_token)
      Logger.debug("NOTION TOKEN", (await this.cacheManager.get('notionToken')));
      return {
        accessToken: accessToken.access_token,
        tokenType: accessToken.token_type,
      };
    } catch (error) {
      Logger.error(error.response ? error.response.data : error.message);
      throw new RpcException(error);
    }
  }
}

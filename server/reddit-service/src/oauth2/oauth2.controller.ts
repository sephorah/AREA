import { Controller, Inject, Logger } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import {
  RequestAuthSent,
  RequestAccessTokenParams,
  RequestAccessTokenSent,
} from '../protos/interfaces';
import axios from 'axios';
import constants from '../constants';
import { generateRandomString } from 'src/utils';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { RedditTriggersService } from 'src/triggers/triggers.service';
import { AppService } from 'src/app.service';

@Controller('')
export class RedditOAuth2Controller {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly triggersService: RedditTriggersService,
    private readonly appService: AppService,
  ) {}

  @GrpcMethod('RedditService', 'RequestAccess')
  requestAccess(): RequestAuthSent {
    const clientId = constants().redditClientId;
    const redirectUri = constants().redirectUri;
    const scope = encodeURIComponent('identity history read submit');
    const state = generateRandomString(16);
    const url = `https://www.reddit.com/api/v1/authorize?client_id=${clientId}&response_type=code&state=${state}&redirect_uri=${redirectUri}&duration=permanent&scope=${scope}`;

    return { url: url };
  }

  @GrpcMethod('RedditService', 'RequestAccessToken')
  async requestAccessToken({
    code,
  }: RequestAccessTokenParams): Promise<RequestAccessTokenSent> {
    const clientId = constants().redditClientId;
    const clientSecret = constants().redditClientSecret;
    const redirectUri = constants().redirectUri;
    const url = 'https://www.reddit.com/api/v1/access_token';
    const urlUsername = 'https://oauth.reddit.com/api/v1/me';

    try {
      const accessToken = (
        await axios.post(url, null, {
          params: {
            code: code,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code',
          },
          headers: {
            Authorization:
              'Basic ' +
              Buffer.from(clientId + ':' + clientSecret).toString('base64'),
          },
        })
      ).data;
      await this.cacheManager.set('redditToken', accessToken.access_token);
      await this.cacheManager.set(
        'redditRefreshToken',
        accessToken.refresh_token,
      );
      Logger.debug('EXPIRES WHEN', accessToken.expires_in);
      Logger.debug(
        'REFRESH TOKEN REDDIT',
        await this.cacheManager.get('redditRefreshToken'),
      );
      Logger.debug(
        'CURRENT TOKENS IN REDDIT',
        await this.cacheManager.get('redditToken'),
      );
      const username = (
        await axios.get(urlUsername, {
          headers: {
            Authorization: `Bearer ${accessToken.access_token}`,
          },
        })
      ).data.name;
      Logger.debug('USERNAME REDDIT', username);
      await this.cacheManager.set('redditUsername', username);
      Logger.debug(
        'CURRENT USERNAME IN REDDIT',
        await this.cacheManager.get('redditUsername'),
      );
      this.triggersService.getLatestPostSavedReddit();
      this.triggersService.getLatestUpvotedPost();
      this.triggersService.getLatestDownvotedPostReddit();
      return {
        accessToken: accessToken.access_token,
        tokenType: accessToken.token_type,
      };
    } catch (error) {
      return error;
    }
  }
}

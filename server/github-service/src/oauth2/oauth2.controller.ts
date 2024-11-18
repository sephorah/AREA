import { Controller, Inject, Logger } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import {
  RequestAuthSent,
  RequestAccessTokenParams,
  RequestAccessTokenSent,
  AccessToken,
} from '../protos/interfaces';
import axios from 'axios';
import constants from '../constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AppService } from 'src/app.service';
import { generateRandomString } from 'src/utils';

@Controller('')
export class GithubOAuth2Controller {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly appService: AppService,
  ) {}

  @GrpcMethod('GithubService', 'RequestAuthorization')
  requestAuthorization(): RequestAuthSent {
    const clientId = constants().githubClientId;
    const redirectUri = constants().redirectUri;
    const scope = encodeURIComponent('read:user repo gist');
    const state = generateRandomString(16);
    const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;

    return { url: url };
  }

  @GrpcMethod('GithubService', 'RequestAccessToken')
  async requestAccessToken({
    code,
  }: RequestAccessTokenParams): Promise<RequestAccessTokenSent> {
    const clientId = constants().githubClientId;
    const clientSecret = constants().githubClientSecret;
    const redirectUri = constants().redirectUri;
    const url = `https://github.com/login/oauth/access_token`;
    Logger.debug('HEY IN GITHUB SERVICE ACCESS TOKEN');
    try {
      const accessToken = (
        await axios.post(url, null, {
          params: {
            code: code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
          },
          headers: {
            Accept: 'application/json',
          },
        })
      ).data;

      await this.cacheManager.set('githubToken', accessToken.access_token);
      Logger.debug(
        'CURRENT TOKENS IN GITHUB',
        await this.cacheManager.get('githubToken'),
      );

      const userInfoUrl = 'https://api.github.com/user';
      const userInfo = (
        await axios.get(userInfoUrl, {
          headers: {
            Authorization: `Bearer ${accessToken.access_token}`,
            Accept: 'application/vnd.github+json',
          },
        })
      ).data;
      const username = userInfo.login;
      await this.cacheManager.set('githubLogin', username);
      Logger.debug('GITHUB EXPIRES WHEN ', accessToken);
      return {
        accessToken: accessToken.access_token,
        tokenType: accessToken.token_type,
      };
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('GithubService', 'LoginWithGithub')
  async loginWithGithub(): Promise<AccessToken> {
    const url = 'https://api.github.com/user';
    const accessToken = await this.cacheManager.get('githubToken');
    Logger.debug('HERERRE', accessToken);
    if (!accessToken) {
      Logger.log('Undefined access token for Github');
      return;
    }
    try {
      const userInfo = (
        await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/vnd.github+json',
          },
        })
      ).data;
      const email = userInfo.email;
      const username = userInfo.login;
      await this.cacheManager.set('githubLogin', username);
      Logger.debug('ARGS TO LOGIN WITH GITHUB', username, email);
      return this.appService.loginWithProvider({
        username: username,
        email: email,
        provider: 'github',
      });
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }
}

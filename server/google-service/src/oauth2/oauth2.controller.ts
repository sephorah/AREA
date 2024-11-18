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
import { YoutubeService } from 'src/youtube/youtube.service';

// interface UserInfo {
//   id: string;
//   email: string;
//   verified_email: string;
//   picture: string;
// }

@Controller('')
export class GoogleOAuth2Controller {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly appService: AppService,
    private readonly youtubeService: YoutubeService,
  ) {}

  @GrpcMethod('GoogleService', 'RequestAuthorization')
  requestAuthorization(): RequestAuthSent {
    const clientId = constants().googleClientId;
    const redirectUri = constants().redirectUri;
    const scope = encodeURIComponent(
      'email https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/youtube.readonly',
    );
    const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&access_type=offline&prompt=consent`;

    return { url: url };
  }

  @GrpcMethod('GoogleService', 'RequestAccessToken')
  async requestAccessToken({
    code,
  }: RequestAccessTokenParams): Promise<RequestAccessTokenSent> {
    const clientId = constants().googleClientId;
    const clientSecret = constants().googleClientSecret;
    const redirectUri = constants().redirectUri;
    const url = `https://oauth2.googleapis.com/token`;

    try {
      const accessToken = (
        await axios.post(url, null, {
          params: {
            code: code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code',
          },
        })
      ).data;
      Logger.debug('HEY ', accessToken);
      await this.cacheManager.set('googleToken', accessToken.access_token);
      await this.cacheManager.set(
        'googleRefreshToken',
        accessToken.refresh_token,
      );
      Logger.debug(
        'REFRESH GOOGLE SPOTIFY',
        await this.cacheManager.get('googleRefreshToken'),
      );
      await this.youtubeService.getUserNbLikedVideos();
      await this.youtubeService.getUserNbSubscriptions();
      Logger.debug(
        'CURRENT TOKENS IN GOOGLE GMAIL',
        await this.cacheManager.get('googleToken'),
      );
      return {
        accessToken: accessToken.access_token,
        tokenType: accessToken.token_type,
      };
    } catch (error) {
      return error;
    }
  }

  @GrpcMethod('GoogleService', 'LoginWithGoogle')
  async loginWithGoogle(): Promise<AccessToken> {
    const url = 'https://www.googleapis.com/oauth2/v2/userinfo';
    const accessToken = await this.cacheManager.get('googleToken');
    Logger.debug('HERERRE', accessToken);
    if (!accessToken) {
      Logger.log('Undefined access token for Google');
      return;
    }
    try {
      const email = (
        await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      ).data.email;
      const username = email.split('@')[0];
      Logger.debug('ARGS TO LOGIN WITH GOOGLE', username, email);
      return this.appService.loginWithProvider({
        username: username,
        email: email,
        provider: 'google',
      });
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('GoogleService', 'RefreshToken')
  async refreshToken(): Promise<void> {
    const clientId = constants().googleClientId;
    const clientSecret = constants().googleClientSecret;
    const redirectUri = constants().redirectUri;
    const url = 'https://oauth2.googleapis.com/token';
    const refreshToken = await this.cacheManager.get('googleRefreshToken');

    Logger.debug('REFRESH TOKEN', refreshToken);
    if (!refreshToken) {
      Logger.log('Undefined refresh token for Google');
      return;
    }
    try {
      const newAccessToken = (
        await axios.post(url, null, {
          params: {
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
          },
        })
      ).data;
      await this.cacheManager.set('googleToken', newAccessToken.access_token);
      Logger.debug(
        'NEW ACCESS TOKEN',
        await this.cacheManager.get('googleToken'),
      );
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }
}

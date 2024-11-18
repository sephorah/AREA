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
import { generateRandomString } from 'src/utils';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { SpotifyTriggersService } from 'src/triggers/triggers.service';
import { AppService } from 'src/app.service';

@Controller('')
export class SpotifyOAuth2Controller {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly triggersService: SpotifyTriggersService,
    private readonly appService: AppService,
  ) {}

  @GrpcMethod('SpotifyService', 'RequestAccess')
  requestAccess(): RequestAuthSent {
    const clientId = constants().spotifyClientId;
    const redirectUri = constants().redirectUri;
    const scope = encodeURIComponent(
      'user-library-read user-read-email user-modify-playback-state',
    );
    const state = generateRandomString(16);
    const url = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}&state=${state}`;

    return { url: url };
  }

  @GrpcMethod('SpotifyService', 'RequestAccessToken')
  async requestAccessToken({
    code,
  }: RequestAccessTokenParams): Promise<RequestAccessTokenSent> {
    const clientId = constants().spotifyClientId;
    const clientSecret = constants().spotifyClientSecret;
    const redirectUri = constants().redirectUri;
    const url = 'https://accounts.spotify.com/api/token';

    try {
      const accessToken = (
        await axios.post(url, null, {
          params: {
            code: code,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code',
          },
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization:
              'Basic ' +
              Buffer.from(clientId + ':' + clientSecret).toString('base64'),
          },
        })
      ).data;
      await this.cacheManager.set('spotifyToken', accessToken.access_token);
      await this.cacheManager.set(
        'spotifyRefreshToken',
        accessToken.refresh_token,
      );
      Logger.debug(
        'REFRESH TOKEN SPOTIFY',
        await this.cacheManager.get('spotifyRefreshToken'),
      );
      await this.triggersService.getUserSavedTracks();
      await this.triggersService.getUserSavedShows();
      await this.triggersService.getUserSavedAlbums();
      return {
        accessToken: accessToken.access_token,
        tokenType: accessToken.token_type,
      };
    } catch (error) {
      return error;
    }
  }

  @GrpcMethod('SpotifyService', 'LoginWithSpotify')
  async loginWithSpotify(): Promise<AccessToken> {
    const url = 'https://api.spotify.com/v1/me';
    const accessToken = await this.cacheManager.get('spotifyToken');
    Logger.debug('SPOTIFY HERE TOKEN', accessToken);
    if (!accessToken) {
      Logger.log('Undefined access token for Spotify');
      return;
    }
    try {
      const userInfo = (
        await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      ).data;
      const email = userInfo.email;
      const username = userInfo.display_name
        ? userInfo.display_name
        : email.split('@')[0];
      Logger.debug('ARGS TO LOGIN WITH SPOTIFY', username, email);
      return this.appService.loginWithProvider({
        username: username,
        email: email,
        provider: 'spotify',
      });
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('SpotifyService', 'RefreshToken')
  async refreshToken(): Promise<void> {
    const clientId = constants().spotifyClientId;
    const clientSecret = constants().spotifyClientSecret;
    const url = 'https://accounts.spotify.com/api/token';
    const refreshToken = await this.cacheManager.get('spotifyRefreshToken');

    Logger.debug('REFRESH TOKEN', refreshToken);
    if (!refreshToken) {
      Logger.log('Undefined refresh token for Spotify');
      return;
    }
    try {
      const newAccessToken = (
        await axios.post(
          url,
          {
            client_id: clientId,
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization:
                'Basic ' +
                Buffer.from(clientId + ':' + clientSecret).toString('base64'),
            },
          },
        )
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

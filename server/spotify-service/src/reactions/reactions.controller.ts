import { Controller, Inject, Logger } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import axios from 'axios';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Controller()
export class SpotifyReactionsController {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  @GrpcMethod('SpotifyService', 'StartResumePlayback')
  async startResumePlayback(): Promise<void> {
    const url = `https://api.spotify.com/v1/me/player/play`;
    const accessToken = await this.cacheManager.get('spotifyToken');
    Logger.debug('IN StartResumePlayback OF SPOTIFY');
    try {
      await axios.put(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('SpotifyService', 'PausePlayback')
  async pausePlayback(): Promise<void> {
    const url = `https://api.spotify.com/v1/me/player/pause`;
    const accessToken = await this.cacheManager.get('spotifyToken');
    Logger.debug('IN pausePlayback OF SPOTIFY');
    try {
      await axios.put(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('SpotifyService', 'SkipToNextMusic')
  async skipToNextMusic(): Promise<void> {
    const url = `https://api.spotify.com/v1/me/player/next`;
    const accessToken = await this.cacheManager.get('spotifyToken');
    Logger.debug('IN skipToNextMusic OF SPOTIFY');
    try {
      await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }
}

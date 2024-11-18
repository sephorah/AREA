import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { NewLikedVideo, NewSubscription } from 'src/protos/interfaces';
import { Cache } from 'cache-manager';

interface GetNewLikedVideosParams {
  accessToken: string;
  nbIterations: number;
  limit: number;
  nbNewLikedVideos: number;
  likedVideos: any;
}

interface GetNewSubscriptionsParams {
  accessToken: string;
  nbIterations: number;
  limit: number;
  nbNewSubscriptions: number;
  subscriptions: any;
}

@Injectable()
export class YoutubeService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getNewLikedVideos({
    accessToken,
    nbIterations,
    limit,
    nbNewLikedVideos,
    likedVideos,
  }: GetNewLikedVideosParams): Promise<NewLikedVideo[]> {
    let totalNewLikedVideos: NewLikedVideo[] = likedVideos.items
      .slice(0, nbNewLikedVideos)
      .map((likedVideo: any) => {
        return {
          title: likedVideo.snippet.title,
          description: likedVideo.snippet.description,
          url: `https://www.youtube.com/watch?v=${likedVideo.id}`,
          publishedAt: likedVideo.snippet.publishedAt,
          channel: likedVideo.snippet.channelTitle,
        };
      });
    await this.cacheManager.set(
      'totalLikedVideos',
      likedVideos.pageInfo.totalResults,
    );
    if (nbIterations > 0) {
      const nextPageToken = likedVideos.nextPageToken;
      let nextUrl = `https://www.googleapis.com/youtube/v3/videos?myRating=like&part=snippet&maxResults=25&pageToken=${nextPageToken}`;
      for (const {} of Array(nbIterations).keys()) {
        const nextRetrievedLikedVideos = (
          await axios.get(nextUrl, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
        ).data;
        const nextLikedVideos = nextRetrievedLikedVideos.items
          .slice(0, nbNewLikedVideos)
          .map((likedVideo: any) => {
            return {
              title: likedVideo.snippet.title,
              description: likedVideo.snippet.description,
              url: `https://www.youtube.com/watch?v=${likedVideo.id}`,
              publishedAt: likedVideo.snippet.publishedAt,
              channel: likedVideo.snippet.channelTitle,
            };
          });
        totalNewLikedVideos = [...totalNewLikedVideos, nextLikedVideos];
        nextUrl = `https://www.googleapis.com/youtube/v3/videos?myRating=like&part=snippet&maxResults=25&pageToken=${nextRetrievedLikedVideos.nextPageToken}`;
        nbNewLikedVideos -= limit;
      }
    }
    Logger.debug('LIKED VIDEOS TOTAL', totalNewLikedVideos);
    return totalNewLikedVideos;
  }

  async checkUserLikedVideos(): Promise<NewLikedVideo[]> {
    const limit = 25;
    const url = `https://www.googleapis.com/youtube/v3/videos?myRating=like&part=snippet&maxResults=${limit}`;
    const accessToken: string = await this.cacheManager.get('googleToken');
    const currentNbLikedVideos: number =
      await this.cacheManager.get('totalLikedVideos');

    if (!accessToken) {
      Logger.log('Undefined access token for Google');
      return;
    }
    try {
      const likedVideos = (
        await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      ).data;
      const totalLikedVideos = likedVideos.pageInfo.totalResults;
      if (totalLikedVideos > currentNbLikedVideos) {
        const nbNewLikedVideos = totalLikedVideos - currentNbLikedVideos;
        const nbIterations = Math.round(nbNewLikedVideos / limit);
        return await this.getNewLikedVideos({
          accessToken,
          nbNewLikedVideos,
          limit,
          nbIterations,
          likedVideos,
        });
      } else {
        return [];
      }
    } catch (error) {
      Logger.error(error);
      return error;
    }
  }

  async getUserNbLikedVideos(): Promise<void> {
    const url =
      'https://www.googleapis.com/youtube/v3/videos?myRating=like&part=snippet';
    const accessToken = await this.cacheManager.get('googleToken');

    try {
      const totalLikedVideos = (
        await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      ).data.pageInfo.totalResults;
      await this.cacheManager.set('totalLikedVideos', totalLikedVideos);
      Logger.debug(
        'NB LIKED VIDEOS',
        await this.cacheManager.get('totalLikedVideos'),
      );
    } catch (error) {
      Logger.error(error);
      return error;
    }
  }

  async getNewSubscriptions({
    accessToken,
    nbIterations,
    limit,
    nbNewSubscriptions,
    subscriptions,
  }: GetNewSubscriptionsParams): Promise<NewSubscription[]> {
    let totalNewSubscriptions: NewSubscription[] = subscriptions.items
      .slice(0, nbNewSubscriptions)
      .map((channel: any) => {
        return {
          title: channel.snippet.title,
          description: channel.snippet.description,
          url: `https://www.youtube.com/channel/${channel.snippet.resourceId.channelId}`,
        };
      });
    await this.cacheManager.set(
      'totalSubscriptions',
      subscriptions.pageInfo.totalResults,
    );
    if (nbIterations > 0) {
      const nextPageToken = subscriptions.nextPageToken;
      let nextUrl = `https://youtube.googleapis.com/youtube/v3/subscriptions?part=snippet%2CcontentDetails&mine=true&maxResults=25&pageToken=${nextPageToken}`;
      for (const {} of Array(nbIterations).keys()) {
        const nextRetrievedSubscriptions = (
          await axios.get(nextUrl, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
        ).data;
        const nextSubscriptions = nextRetrievedSubscriptions.items
          .slice(0, nbNewSubscriptions)
          .map((channel: any) => {
            return {
              title: channel.snippet.title,
              description: channel.snippet.description,
              url: `https://www.youtube.com/channel/${channel.snippet.resourceId.channelId}`,
            };
          });
        totalNewSubscriptions = [...totalNewSubscriptions, nextSubscriptions];
        nextUrl = `https://www.googleapis.com/youtube/v3/videos?myRating=like&part=snippet&maxResults=25&pageToken=${nextRetrievedSubscriptions.nextPageToken}`;
        nbNewSubscriptions -= limit;
      }
    }
    Logger.debug('SUB TOTAL', totalNewSubscriptions);
    return totalNewSubscriptions;
  }

  async checkUserSubscriptions(): Promise<NewSubscription[]> {
    const limit = 25;
    const url = `https://youtube.googleapis.com/youtube/v3/subscriptions?part=snippet%2CcontentDetails&mine=true&maxResults=${limit}`;
    const accessToken: string = await this.cacheManager.get('googleToken');
    const currentTotalSubscriptions: number =
      await this.cacheManager.get('totalSubscriptions');

    if (!accessToken) {
      Logger.log('Undefined access token for Google');
      return;
    }
    try {
      const subscriptions = (
        await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      ).data;
      const totalSubscriptions = subscriptions.pageInfo.totalResults;
      if (totalSubscriptions > currentTotalSubscriptions) {
        const nbNewSubscriptions =
          totalSubscriptions - currentTotalSubscriptions;
        const nbIterations = Math.round(nbNewSubscriptions / limit);
        return await this.getNewSubscriptions({
          accessToken,
          nbNewSubscriptions,
          limit,
          nbIterations,
          subscriptions,
        });
      } else {
        return [];
      }
    } catch (error) {
      Logger.error(error);
      return error;
    }
  }

  async getUserNbSubscriptions(): Promise<void> {
    const url =
      'https://youtube.googleapis.com/youtube/v3/subscriptions?part=snippet%2CcontentDetails&mine=true';
    const accessToken = await this.cacheManager.get('googleToken');

    try {
      const totalSubscriptions = (
        await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      ).data.pageInfo.totalResults;
      await this.cacheManager.set('totalSubscriptions', totalSubscriptions);
      Logger.debug(
        'NB SUBSCRIPTIONS',
        await this.cacheManager.get('totalSubscriptions'),
      );
    } catch (error) {
      Logger.error(error);
      return error;
    }
  }
}

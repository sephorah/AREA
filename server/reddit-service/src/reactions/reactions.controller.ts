import { Controller, Inject, Logger } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import axios from 'axios';
import { SubmitLinkParams, SubmitTextParams } from 'src/protos/interfaces';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Controller()
export class RedditReactionsController {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  @GrpcMethod('RedditService', 'SubmitText')
  async submitText(data: SubmitTextParams): Promise<void> {
    Logger.debug('HO', data);
    Logger.debug('DATA ', data.subreddit, data.text, data.title);
    const url = `https://oauth.reddit.com/api/submit?sr=${data.subreddit}&title=${data.title}&text=${encodeURIComponent(data.text)}&kind=self`;
    const accessToken = await this.cacheManager.get('redditToken');
    Logger.debug('IN SUBMIT TEXT OF REDDIt');
    if (!data.title || !data.text) {
      throw new RpcException('Invalid arguments for submitting text on Reddit');
    }
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

  @GrpcMethod('RedditService', 'SubmitLink')
  async submitLink(data: SubmitLinkParams): Promise<void> {
    const url = `https://oauth.reddit.com/api/submit?sr=${data.subreddit}&title=${data.title}&text=${encodeURIComponent(data.text)}&kind=link&url=${data.url}`;
    const accessToken = await this.cacheManager.get('redditToken');
    Logger.debug('IN SUBMIT LINK OF REDDIt');
    if (!data.title || !data.text) {
      throw new RpcException('Invalid arguments for submitting link on Reddit');
    }
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

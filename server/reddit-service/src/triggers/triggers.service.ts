import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { Cache } from 'cache-manager';
import { NewSavedPost, NewUpDownvotedPost } from 'src/protos/interfaces';

@Injectable()
export class RedditTriggersService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async checkUserNewSavedPosts(): Promise<NewSavedPost[]> {
    const username = await this.cacheManager.get('redditUsername');
    const url = `https://oauth.reddit.com/user/${username}/saved`;
    const accessToken = await this.cacheManager.get('redditToken');
    const previousLatestSavedPostId = await this.cacheManager.get(
      'latestSavedPostIdReddit',
    );

    try {
      const newSavedPostsData = (
        await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      ).data.data.children;
      const newFirstSavedPost = newSavedPostsData[0].data.id;
      Logger.debug('NEW FIRST SAVED POST ', newFirstSavedPost);
      const previousLatestSavedPostFound = newSavedPostsData.indexOf(
        newSavedPostsData.find(
          (post: any) => post.data.id == previousLatestSavedPostId,
        ),
      );
      let newSavedPosts: NewSavedPost[] = newSavedPostsData.map((post: any) => {
        return {
          titlePost: post.data.title || post.data.body,
          postURL: post.data.permalink,
          subreddit: post.data.subreddit,
          postedAt: post.data.created,
        };
      });
      if (previousLatestSavedPostFound != -1) {
        newSavedPosts = newSavedPosts.slice(0, previousLatestSavedPostFound);
      } else {
        newSavedPosts = [];
      }
      Logger.debug('NEW SAVED POSTS', JSON.stringify(newSavedPosts));
      Logger.debug('NEW ID LATEST POST', newFirstSavedPost);
      await this.cacheManager.set('latestSavedPostIdReddit', newFirstSavedPost);
      Logger.debug(
        'NEW IN CACHE LATEST SAVED POST',
        await this.cacheManager.get('latestSavedPostIdReddit'),
      );
      return newSavedPosts;
    } catch (error) {
      Logger.error(error);
      return error;
    }
  }

  async checkUserNewUpvotedPosts(): Promise<NewUpDownvotedPost[]> {
    const username = await this.cacheManager.get('redditUsername');
    const url = `https://oauth.reddit.com/user/${username}/upvoted`;
    const accessToken = await this.cacheManager.get('redditToken');
    const previousLatestUpvotedPostId = await this.cacheManager.get(
      'latestUpvotedPostIdReddit',
    );

    try {
      const newUpvotedPostsData = (
        await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      ).data.data.children;
      const newLatestUpvotedPost = newUpvotedPostsData[0].data.id;
      Logger.debug('NEW FIRST UPVOTED POST ', newLatestUpvotedPost);
      const previousLatestUpvotedPostFound = newUpvotedPostsData.indexOf(
        newUpvotedPostsData.find(
          (post: any) => post.data.id == previousLatestUpvotedPostId,
        ),
      );
      let newUpvotedPosts: NewUpDownvotedPost[] = newUpvotedPostsData.map(
        (post: any) => {
          return {
            titlePost: post.data.title,
            postURL: post.data.permalink,
            subreddit: post.data.subreddit,
            postedAt: post.data.created,
          };
        },
      );
      if (previousLatestUpvotedPostFound != -1) {
        newUpvotedPosts = newUpvotedPosts.slice(
          0,
          previousLatestUpvotedPostFound,
        );
      } else {
        newUpvotedPosts = [];
      }
      Logger.debug('NEW UPVOTED POSTS', JSON.stringify(newUpvotedPosts));
      Logger.debug('NEW ID UPVOTED POST', newLatestUpvotedPost);
      await this.cacheManager.set(
        'latestUpvotedPostIdReddit',
        newLatestUpvotedPost,
      );
      Logger.debug(
        'NEW IN CACHE LATEST UPVOTED POST',
        await this.cacheManager.get('latestUpvotedPostIdReddit'),
      );
      return newUpvotedPosts;
    } catch (error) {
      Logger.error(error);
      return error;
    }
  }

  async checkUserNewDownvotedPosts(): Promise<NewUpDownvotedPost[]> {
    const username = await this.cacheManager.get('redditUsername');
    const url = `https://oauth.reddit.com/user/${username}/downvoted`;
    const accessToken = await this.cacheManager.get('redditToken');
    const previousLatestDownvotedPostId = await this.cacheManager.get(
      'latestDownvotedPostIdReddit',
    );

    try {
      const newDownvotedPostsData = (
        await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      ).data.data.children;
      const newLatestDownvotedPost = newDownvotedPostsData[0].data.id;
      Logger.debug('NEW FIRST DOWNVOTED POST ', newLatestDownvotedPost);
      const previousLatestDownvotedPostFound = newDownvotedPostsData.indexOf(
        newDownvotedPostsData.find(
          (post: any) => post.data.id == previousLatestDownvotedPostId,
        ),
      );
      let newDownvotedPosts: NewUpDownvotedPost[] = newDownvotedPostsData.map(
        (post: any) => {
          return {
            titlePost: post.data.title,
            postURL: post.data.permalink,
            subreddit: post.data.subreddit,
            postedAt: post.data.created,
          };
        },
      );
      if (previousLatestDownvotedPostFound != -1) {
        newDownvotedPosts = newDownvotedPosts.slice(
          0,
          previousLatestDownvotedPostFound,
        );
      } else {
        newDownvotedPosts = [];
      }
      Logger.debug('NEW DOWNVOTED POSTS', JSON.stringify(newDownvotedPosts));
      Logger.debug('NEW ID DOWNVOTED POST', newLatestDownvotedPost);
      await this.cacheManager.set(
        'latestDownvotedPostIdReddit',
        newLatestDownvotedPost,
      );
      Logger.debug(
        'NEW IN CACHE LATEST DOWNVOTED POST',
        await this.cacheManager.get('latestDownvotedPostIdReddit'),
      );
      return newDownvotedPosts;
    } catch (error) {
      Logger.error(error);
      return error;
    }
  }

  async getLatestPostSavedReddit(): Promise<void> {
    const username = await this.cacheManager.get('redditUsername');
    const url = `https://oauth.reddit.com/user/${username}/saved`;
    const accessToken = await this.cacheManager.get('redditToken');

    try {
      const latestSavedPostId = (
        await axios.get(url, {
          params: {
            limit: 1,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      ).data.data.children[0].data.id;
      Logger.debug('ID LATEST POST', latestSavedPostId);
      await this.cacheManager.set('latestSavedPostIdReddit', latestSavedPostId);
      Logger.debug(
        'IN CACHE LATEST SAVED POST',
        await this.cacheManager.get('latestSavedPostIdReddit'),
      );
    } catch (error) {
      Logger.error(error);
      return error;
    }
  }

  async getLatestUpvotedPost(): Promise<void> {
    const username = await this.cacheManager.get('redditUsername');
    const url = `https://oauth.reddit.com/user/${username}/upvoted`;
    const accessToken = await this.cacheManager.get('redditToken');

    try {
      const latestUpvotedPostId = (
        await axios.get(url, {
          params: {
            limit: 1,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      ).data.data.children[0].data.id;
      Logger.debug('ID LATEST UPVOTED POST', latestUpvotedPostId);
      await this.cacheManager.set(
        'latestUpvotedPostIdReddit',
        latestUpvotedPostId,
      );
      Logger.debug(
        'IN CACHE LATEST UPVOTED POST',
        await this.cacheManager.get('latestUpvotedPostIdReddit'),
      );
    } catch (error) {
      Logger.error(error);
      return error;
    }
  }

  async getLatestDownvotedPostReddit(): Promise<void> {
    const username = await this.cacheManager.get('redditUsername');
    const url = `https://oauth.reddit.com/user/${username}/downvoted`;
    const accessToken = await this.cacheManager.get('redditToken');

    try {
      const latestDownvotedPostId = (
        await axios.get(url, {
          params: {
            limit: 1,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      ).data.data.children[0].data.id;
      Logger.debug('ID LATEST DOWN POST', latestDownvotedPostId);
      await this.cacheManager.set(
        'latestDownvotedPostIdReddit',
        latestDownvotedPostId,
      );
      Logger.debug(
        'IN CACHE LATEST DOWN POST',
        await this.cacheManager.get('latestDownvotedPostIdReddit'),
      );
    } catch (error) {
      Logger.error(error);
      return error;
    }
  }
}

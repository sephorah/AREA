import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { RedditTriggersService } from './triggers.service';
import { NewSavedPosts, NewUpDownvotedPosts } from 'src/protos/interfaces';

@Controller()
export class RedditTriggersController {
  constructor(private readonly triggersService: RedditTriggersService) {}

  @GrpcMethod('RedditService', 'CheckUserSavedPosts')
  async checkUserSavedTracks(): Promise<NewSavedPosts> {
    try {
      return {
        newSavedPosts: await this.triggersService.checkUserNewSavedPosts(),
      };
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('RedditService', 'CheckUserUpvotedPosts')
  async checkUserUpvotedPosts(): Promise<NewUpDownvotedPosts> {
    try {
      return {
        newUpDownvotedPosts:
          await this.triggersService.checkUserNewUpvotedPosts(),
      };
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('RedditService', 'CheckUserDownvotedPosts')
  async checkUserDownvotedPosts(): Promise<NewUpDownvotedPosts> {
    try {
      return {
        newUpDownvotedPosts:
          await this.triggersService.checkUserNewDownvotedPosts(),
      };
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }
}

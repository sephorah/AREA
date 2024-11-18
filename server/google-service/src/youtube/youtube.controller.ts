import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { YoutubeService } from './youtube.service';
import { NewLikedVideos, NewSubscriptions } from 'src/protos/interfaces';

@Controller()
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @GrpcMethod('GoogleService', 'CheckNewLikedVideos')
  async checkNewLikedVideos(): Promise<NewLikedVideos> {
    try {
      return {
        newLikedVideos: await this.youtubeService.checkUserLikedVideos(),
      };
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('GoogleService', 'GetNbLikedVideos')
  async getNbLikedVideos(): Promise<void> {
    try {
      await this.youtubeService.getUserNbLikedVideos();
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @GrpcMethod('GoogleService', 'CheckNewSubscriptions')
  async checkNewSubscriptions(): Promise<NewSubscriptions> {
    try {
      return {
        newSubscriptions: await this.youtubeService.checkUserSubscriptions(),
      };
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('GoogleService', 'GetNbSubscriptions')
  async getNbSubscriptions(): Promise<void> {
    try {
      await this.youtubeService.getUserNbSubscriptions();
    } catch (error) {
      throw new RpcException(error);
    }
  }
}

import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import {
  NewSavedAlbums,
  NewSavedShows,
  NewSavedTracks,
} from 'src/protos/interfaces';
import { SpotifyTriggersService } from './triggers.service';

@Controller()
export class SpotifyTriggersController {
  constructor(private readonly triggersService: SpotifyTriggersService) {}

  @GrpcMethod('SpotifyService', 'CheckUserSavedTracks')
  async checkUserSavedTracks(): Promise<NewSavedTracks> {
    try {
      return {
        newSavedTracks: await this.triggersService.checkUserSavedTracks(),
      };
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('SpotifyService', 'GetUserSavedTracks')
  async getUserSavedTracks(): Promise<void> {
    try {
      await this.triggersService.getUserSavedTracks();
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @GrpcMethod('SpotifyService', 'CheckUserSavedShows')
  async checkUserSavedShows(): Promise<NewSavedShows> {
    try {
      return {
        newSavedShows: await this.triggersService.checkUserSavedShows(),
      };
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('SpotifyService', 'GetUserSavedShows')
  async getUserSavedShows(): Promise<void> {
    try {
      await this.triggersService.getUserSavedShows();
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @GrpcMethod('SpotifyService', 'CheckUserSavedAlbums')
  async checkUserSavedAlbums(): Promise<NewSavedAlbums> {
    try {
      return {
        newSavedAlbums: await this.triggersService.checkUserSavedAlbums(),
      };
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('SpotifyService', 'GetUserSavedAlbums')
  async getUserSavedAlbums(): Promise<void> {
    try {
      await this.triggersService.getUserSavedAlbums();
    } catch (error) {
      throw new RpcException(error);
    }
  }
}

import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { DiscordTriggersService } from './triggers.service';
import { DiscordRolesGuild, DiscordServicesName, DiscordUsername, NameOfGuild } from 'src/protos/interfaces';

@Controller()
export class DiscordTriggersController {
  constructor(private readonly triggersService: DiscordTriggersService) { }

  @GrpcMethod('DiscordService', 'GetGuildsInfo')
  async getGuildsInfo({
    name
  }: NameOfGuild): Promise<DiscordRolesGuild> {
    const roles = await this.triggersService.getAllGuildsInfo({ name });
    return { roles: roles.roles }
  }

  @GrpcMethod('DiscordService', 'GetUsername')
  async getUsername(): Promise<DiscordUsername> {
    const username = await this.triggersService.getUsername();
    return { username: username }
  }

  @GrpcMethod('DiscordService', 'GetServicesConnected')
  async getConnectedService(): Promise<DiscordServicesName> {
    const connectedServices = await this.triggersService.getConnectedServices();
    return { listOfServices: connectedServices }
  }
}

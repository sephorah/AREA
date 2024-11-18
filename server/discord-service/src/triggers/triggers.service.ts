import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager'
import { Inject, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { DiscordRolesGuild, NameOfGuild } from 'src/protos/interfaces';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class DiscordTriggersService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

  async getAllGuildsInfo({
    name
  }: NameOfGuild): Promise<DiscordRolesGuild> {
    const url = 'https://discord.com/api/users/@me/guilds';
    const discordToken = await this.cacheManager.get('discordToken');
    let serverId: string;
    let roles: string[];

    const getGuildsInfo = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${discordToken}`,
      },
    });

    getGuildsInfo.data.map((e, i) => {
      if (e.name === name) {
        serverId = e.id
      }
    });

    try {

      roles = (await axios.get(`https://discord.com/api/users/@me/guilds/${serverId}/member`, {
        headers: {
          Authorization: `Bearer ${discordToken}`,
        },
      })).data.roles

      Logger.debug("Info a la base => ", name);
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }

    return { roles: roles };
  }

  async getUsername(): Promise<string> {
    const url = 'https://discord.com/api/users/@me';
    const discordToken = await this.cacheManager.get('discordToken');

    const username: string = (await axios.get(url, {
      headers: {
        Authorization: `Bearer ${discordToken}`,
      },
    })).data.username;

    return username;
  }

  async getConnectedServices(): Promise<string[]> {
    const url = 'https://discord.com/api/users/@me/connections';
    const discordToken = await this.cacheManager.get('discordToken');
    const servicesName: string[] = [];
    
    const servicesInfos = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${discordToken}`,
      },
    });

    servicesInfos.data.map((service) => {
      servicesName.push(service.type);
    })
    return servicesName;
  }
}

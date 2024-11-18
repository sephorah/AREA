import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import {
  RequestAuthSent,
  RequestAccessTokenParams,
  RequestAccessTokenSent,
  AccessToken,
} from '../protos/interfaces';
import axios from 'axios';
import constants from '../constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager'
import { Inject } from '@nestjs/common';
import { AppService } from 'src/app.service';

@Controller('')
export class DiscordOAuth2Controller {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly appService: AppService,
  ) {}

  @GrpcMethod('DiscordService', 'RequestAccess')
  requestAccess(): RequestAuthSent {
    const clientId = constants().discordClientId;
    const redirectUri = constants().redirectUri;
    const scope = 'identify+email+connections+guilds'
    const url = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}&permissions=1115136`;
    return { url: url };
  }

  @GrpcMethod('DiscordService', 'RequestAccessToken')
  async requestAccessToken({
    code,
  }: RequestAccessTokenParams): Promise<RequestAccessTokenSent> {
    console.log("CODE: ", code);
    
    const data = new URLSearchParams({
      client_id: constants().discordClientId,
      client_secret: constants().discordClientSecret,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: constants().redirectUri,
    });

    try {
      const response = await axios.post('https://discord.com/api/oauth2/token', data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      const accessToken = response.data;
      await this.cacheManager.set('discordToken', accessToken.access_token)
      return {
        accessToken: accessToken.access_token,
        tokenType: accessToken.token_type,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error.response ? error.response.data : error.message);
    }
  }

  @GrpcMethod('DiscordService', 'LoginWithDiscord')
  async loginWithDiscord(): Promise<AccessToken> {
    const url = 'https://discord.com/api/users/@me';
    const accessToken = await this.cacheManager.get('discordToken');
    Logger.debug('HERERRE', accessToken);
    if (!accessToken) {
      Logger.log('Undefined access token for Discord');
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
       const username = userInfo.username;

        await this.cacheManager.set('discordLogin', username);
       Logger.debug('ARGS TO LOGIN WITH DIDI', username, email);
      return this.appService.loginWithProvider({
        username: 'test',
        email: 'test@gmail.com',
        provider: 'discord',
      });
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }

  }
}

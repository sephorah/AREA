import { Controller, Get, Inject, Logger, Param, Query } from '@nestjs/common';
import { AppService } from '../app.service';
import { RequestAuthSent } from '../protos/interfaces';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('oauth2')
@ApiTags('Authentification')
export class OAuth2Controller {
  constructor(
    private readonly appService: AppService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // @Get('/accessToken')
  // getAccessTokenLogin(): AccessToken {
  //   // return this.appService.requestAuthorizationGoogle();
  // }

  @Get('/provider/google')
  @ApiOperation({ summary: 'Get URL to connect to Google Service' })
  requestAuthorizationGoogle(): RequestAuthSent {
    return this.appService.requestAuthorizationGoogle();
  }

  @Get('/google/accessToken')
  @ApiOperation({ summary: 'Get access token to use Google service' })
  @ApiResponse({ status: 500, description: 'Wrong or Expired code' })
  async requestAccessTokenGoogle(@Query('code') code: string) {
    return await this.appService.requestAccessTokenGoogle({
      code: code,
    });
  }

  @Get('/login/google')
  @ApiOperation({ summary: 'Login with Google account' })
  @ApiResponse({ status: 500, description: 'Wrong or Expired code' })
  async loginWithGoogle(@Query('code') code: string) {
    await this.appService.requestAccessTokenGoogle({
      code: code,
    });
    Logger.debug('IN LOGIN GOOGLE');
    return await this.appService.loginWithGoogle();
  }

  @Get('/subscribe/google')
  @ApiOperation({ summary: 'Get URL to connect to Google service' })
  subscribeToGoogleService(): RequestAuthSent {
    return this.appService.requestAuthorizationGoogle();
  }

  @Get('/provider/spotify')
  @ApiOperation({ summary: 'Get URL to connect to Spotify service' })
  requestAccessSpotify(): RequestAuthSent {
    return this.appService.requestAccessSpotify();
  }

  @Get('/subscribe/spotify')
  @ApiOperation({ summary: 'Get URL to connect to Spotify service' })
  subscribeToSpotifyService(): RequestAuthSent {
    return this.appService.requestAccessSpotify();
  }

  @Get('/spotify/accessToken')
  @ApiOperation({ summary: 'Get access token to use Spotify service' })
  @ApiResponse({ status: 500, description: 'Wrong or Expired code' })
  requestAccessTokenSpotify(@Query('code') code: string) {
    return this.appService.requestAccessTokenSpotify({
      code: code,
    });
  }

  @Get('/provider/discord')
  @ApiOperation({
    summary: 'Get URL to connect to Discord service but in the login page',
  })
  requestAccessDiscord(): RequestAuthSent {
    return this.appService.requestAccessDiscord();
  }

  @Get('/subscribe/discord')
  @ApiOperation({
    summary: 'Get URL to connect to Discord service but in the service page',
  })
  subscribeDiscord(): RequestAuthSent {
    return this.appService.requestAccessDiscord();
  }

  @Get('/discord/accessToken')
  @ApiOperation({ summary: 'Get access token to use Discord service' })
  @ApiResponse({ status: 500, description: 'Wrong or Expired code' })
  requestAccessTokenDiscord(@Query('code') code: string) {
    return this.appService.requestAccessTokenDiscord({
      code: code,
    });
  }

  @Get('/login/discord')
  @ApiOperation({ summary: 'Login with Discord account' })
  @ApiResponse({ status: 500, description: 'Wrong or Expired code' })
  async loginWithDiscord(@Query('code') code: string) {
    await this.appService.requestAccessTokenDiscord({
      code: code,
    });
    return await this.appService.loginWithDiscord();
  }

  @Get('/login/spotify')
  @ApiOperation({ summary: 'Login with Spotify account' })
  @ApiResponse({ status: 500, description: 'Wrong or Expired code' })
  async loginWithSpotify(@Query('code') code: string) {
    await this.appService.requestAccessTokenSpotify({
      code: code,
    });
    Logger.debug('IN LOGIN SPOTIFY');
    return await this.appService.loginWithSpotify();
  }

  @Get('/provider/github')
  @ApiOperation({ summary: 'Get URL to connect to Github service' })
  requestAuthorizationGithub(): RequestAuthSent {
    return this.appService.requestAccessGithub();
  }

  @Get('/subscribe/github')
  @ApiOperation({ summary: 'Get URL to connect to Github service' })
  subscribeToGithub(): RequestAuthSent {
    return this.appService.requestAccessGithub();
  }

  @Get('/github/accessToken')
  @ApiOperation({ summary: 'Get access token to use Github service' })
  async requestAccessTokenGithub(@Query('code') code: string) {
    return await this.appService.requestAccessTokenGithub({
      code: code,
    });
  }

  @Get('/login/github')
  @ApiOperation({ summary: 'Login with Github account' })
  async loginWithGithub(@Query('code') code: string) {
    await this.appService.requestAccessTokenGithub({
      code: code,
    });
    Logger.debug('IN LOGIN GITHUB');
    return await this.appService.loginWithGithub();
  }

  @Get('/subscribe/reddit')
  @ApiOperation({ summary: 'Get URL to connect to Reddit service' })
  subscribeToReddit(): RequestAuthSent {
    return this.appService.requestAccessReddit();
  }

  @Get('/reddit/accessToken')
  @ApiOperation({ summary: 'Get access token to use Reddit service' })
  async requestAccessTokenReddit(@Query('code') code: string) {
    return await this.appService.requestAccessTokenReddit({
      code: code,
    });
  }

  // @Get('/spotify/authorization/callback')
  // requestAccessTokenSpotify(@Query('code') code: string) {
  //   return this.appService.requestAccessTokenSpotify({
  //     code: code,
  //   });
  // }

  @Get('/service/:service/subscribed')
  @ApiOperation({
    summary: 'Know if the logged in user is subscribed to a service',
  })
  async isSubscribed(@Param('service') service: string) {
    const serviceName = service.toLowerCase();
    const serviceAccessToken: string = await this.cacheManager.get(
      `${serviceName}Token`,
    );

    return {
      service: service,
      connected: serviceAccessToken != undefined,
    };
  }

  @Get('/subscribe/notion')
  @ApiOperation({ summary: 'Get URL to connect to Notion service' })
  requestAccessNotion(): RequestAuthSent {
    return this.appService.requestAccessNotion();
  }

  @Get('/notion/accessToken')
  @ApiOperation({ summary: 'Get access token to use Notion service' })
  @ApiResponse({ status: 500, description: 'Wrong or Expired code' })
  requestAccessTokenNotion(@Query('code') code: string) {
    return this.appService.requestAccessTokenNotion({
      code: code,
    });
  }
}


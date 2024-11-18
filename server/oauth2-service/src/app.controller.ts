import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  RequestAuthSent,
  RequestAccessTokenParams,
  RequestAccessTokenSent,
  AccessToken,
} from './protos/interfaces';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @GrpcMethod('OAuth2Service', 'RequestAuthorizationGoogle')
  requestAuthorizationGoogle(): RequestAuthSent {
    return this.appService.requestAuthorizationGoogle();
  }

  @GrpcMethod('OAuth2Service', 'RequestAccessTokenGoogle')
  async requestAccessTokenGoogle(
    data: RequestAccessTokenParams,
  ): Promise<RequestAccessTokenSent> {
    const res = this.appService.requestAccessTokenGoogle(data);
    return res;
  }

  @GrpcMethod('OAuth2Service', 'LoginWithGoogle')
  async loginWithGoogle(): Promise<AccessToken> {
    Logger.debug('LOGIN GOOGLE OF OAUTH2 SERVICE');
    return this.appService.loginWithGoogle();
  }

  // @GrpcMethod('OAuth2Service', 'RequestAccessGoogleGmail')
  // requestAccessGoogleGmail(): RequestAuthSent {
  //   return this.appService.requestAccessGmailGoogle();
  // }

  @GrpcMethod('OAuth2Service', 'RequestAccessSpotify')
  requestAccessSpotify(): RequestAuthSent {
    return this.appService.requestAccessSpotify();
  }

  @GrpcMethod('OAuth2Service', 'RequestAccessTokenSpotify')
  async requestAccessTokenSpotify(
    data: RequestAccessTokenParams,
  ): Promise<RequestAccessTokenSent> {
    const res = this.appService.requestAccessTokenSpotify(data);
    return res;
  }

  @GrpcMethod('OAuth2Service', 'RequestAccessDiscord')
  requestAccessDiscord(): RequestAuthSent {
    return this.appService.requestAccessDiscord();
  }

  @GrpcMethod('OAuth2Service', 'RequestAccessTokenDiscord')
  async requestAccessTokenDiscord(
    data: RequestAccessTokenParams,
  ): Promise<RequestAccessTokenSent> {
    const res = this.appService.requestAccessTokenDiscord(data);
    return res;
  }

  @GrpcMethod('OAuth2Service', 'LoginWithDiscord')
  async loginWithDiscord(): Promise<AccessToken> {
    return this.appService.loginWithDiscord();
  }
  
  @GrpcMethod('OAuth2Service', 'LoginWithSpotify')
  async loginWithSpotify(): Promise<AccessToken> {
    return this.appService.loginWithSpotify();
  }

  @GrpcMethod('OAuth2Service', 'RequestAccessGithub')
  requestAccessGithub(): RequestAuthSent {
    return this.appService.requestAccessGithub();
  }

  @GrpcMethod('OAuth2Service', 'RequestAccessTokenGithub')
  async requestAccessTokenGithub(
    data: RequestAccessTokenParams,
  ): Promise<RequestAccessTokenSent> {
    const res = this.appService.requestAccessTokenGithub(data);
    return res;
  }

  @GrpcMethod('OAuth2Service', 'LoginWithGithub')
  async loginWithGithub(): Promise<AccessToken> {
    Logger.debug('LOGIN GITHUB OF OAUTH2 SERVICE');
    return this.appService.loginWithGithub();
  }

  @GrpcMethod('OAuth2Service', 'RequestAccessReddit')
  requestAccessReddit(): RequestAuthSent {
    return this.appService.requestAccessReddit();
  }

  @GrpcMethod('OAuth2Service', 'RequestAccessTokenReddit')
  async requestAccessTokenReddit(
    data: RequestAccessTokenParams,
  ): Promise<RequestAccessTokenSent> {
    const res = this.appService.requestAccessTokenReddit(data);
    return res;
  }
  
  @GrpcMethod('OAuth2Service', 'RequestAccessNotion')
  requestAccessNotion(): RequestAuthSent {
    return this.appService.requestAccessNotion();
  }

  @GrpcMethod('OAuth2Service', 'RequestAccessTokenNotion')
  requestAccessTokenNotion({
    code,
    userId
  }: RequestAccessTokenParams): RequestAccessTokenSent {
    const res = this.appService.requestAccessTokenNotion({ code, userId });
    return res;
  }

}

import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  RequestAuthSent,
  RequestAccessTokenSent,
  RequestAccessTokenParams,
  AccessToken,
} from './protos/interfaces';
import { lastValueFrom, Observable } from 'rxjs';

interface GoogleService {
  RequestAuthorization({}): RequestAuthSent;
  RequestAccessToken(
    data: RequestAccessTokenParams,
  ): Observable<RequestAccessTokenSent>;
  // RequestAccessGmail({}): RequestAuthSent;
  LoginWithGoogle({}): Observable<AccessToken>;
}

interface SpotifyService {
  RequestAccess({}): RequestAuthSent;
  RequestAccessToken(
    data: RequestAccessTokenParams,
  ): Observable<RequestAccessTokenSent>;
  LoginWithSpotify({}): Observable<AccessToken>;
}

interface DiscordService {
  RequestAccess({}): RequestAuthSent;
  RequestAccessToken(
    data: RequestAccessTokenParams
  ): Observable<RequestAccessTokenSent>;
  LoginWithDiscord({}): Observable<AccessToken>;
}

interface GithubService {
  RequestAuthorization({}): RequestAuthSent;
  RequestAccessToken(
    data: RequestAccessTokenParams,
  ): Observable<RequestAccessTokenSent>;
  LoginWithGithub({}): Observable<AccessToken>;
}

interface RedditService {
  RequestAccess({}): RequestAuthSent;
  RequestAccessToken(
    data: RequestAccessTokenParams,
  ): Observable<RequestAccessTokenSent>;
}

interface NotionService {
  RequestAccess({}): RequestAuthSent;
  RequestAccessToken(data: RequestAccessTokenParams): RequestAccessTokenSent;
}

@Injectable()
export class AppService implements OnModuleInit {
  private googleService: GoogleService;
  private spotifyService: SpotifyService;
  private discordService: DiscordService;
  private githubService: GithubService;
  private redditService: RedditService;
  private notionService: NotionService;

  constructor(
    @Inject('GOOGLE_PACKAGE') private googleClient: ClientGrpc,
    @Inject('SPOTIFY_PACKAGE') private spotifyClient: ClientGrpc,
    @Inject('DISCORD_PACKAGE') private discordClient: ClientGrpc,
    @Inject('GITHUB_PACKAGE') private githubClient: ClientGrpc,
    @Inject('REDDIT_PACKAGE') private redditClient: ClientGrpc,
    @Inject('NOTION_PACKAGE') private notionClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.googleService =
      this.googleClient.getService<GoogleService>('GoogleService');
    this.spotifyService =
      this.spotifyClient.getService<SpotifyService>('SpotifyService');
    this.discordService =
      this.discordClient.getService<DiscordService>('DiscordService');
    this.githubService =
      this.githubClient.getService<GithubService>('GithubService');
    this.redditService =
      this.redditClient.getService<RedditService>('RedditService');
    this.notionService =
      this.notionClient.getService<NotionService>('NotionService');
  }

  requestAuthorizationGoogle(): RequestAuthSent {
    return this.googleService.RequestAuthorization({});
  }

  async requestAccessTokenGoogle(
    data: RequestAccessTokenParams,
  ): Promise<RequestAccessTokenSent> {
    return await lastValueFrom(this.googleService.RequestAccessToken(data));
  }

  async loginWithGoogle(): Promise<AccessToken> {
    return await lastValueFrom(this.googleService.LoginWithGoogle({}));
  }

  // requestAccessGmailGoogle(): RequestAuthSent {
  //   return this.googleService.RequestAccessGmail({});
  // }

  requestAccessSpotify(): RequestAuthSent {
    return this.spotifyService.RequestAccess({});
  }

  async requestAccessTokenSpotify(
    data: RequestAccessTokenParams,
  ): Promise<RequestAccessTokenSent> {
    return await lastValueFrom(this.spotifyService.RequestAccessToken(data));
  }

  requestAccessDiscord(): RequestAuthSent {
    return this.discordService.RequestAccess({});
  }

  async requestAccessTokenDiscord(
    data: RequestAccessTokenParams,
  ): Promise<RequestAccessTokenSent> {
    return await lastValueFrom(this.discordService.RequestAccessToken(data));
  }

  async loginWithDiscord(): Promise<AccessToken> {
    return await lastValueFrom(this.discordService.LoginWithDiscord({}));
  }

  async loginWithSpotify(): Promise<AccessToken> {
    return await lastValueFrom(this.spotifyService.LoginWithSpotify({}));
  }

  requestAccessGithub(): RequestAuthSent {
    return this.githubService.RequestAuthorization({});
  }

  async requestAccessTokenGithub(
    data: RequestAccessTokenParams,
  ): Promise<RequestAccessTokenSent> {
    Logger.debug('THAT WAS SO NO RIGHT');
    return await lastValueFrom(this.githubService.RequestAccessToken(data));
  }

  async loginWithGithub(): Promise<AccessToken> {
    return await lastValueFrom(this.githubService.LoginWithGithub({}));
  }

  async requestAccessTokenReddit(
    data: RequestAccessTokenParams,
  ): Promise<RequestAccessTokenSent> {
    return await lastValueFrom(this.redditService.RequestAccessToken(data));
  }

  requestAccessReddit(): RequestAuthSent {
    return this.redditService.RequestAccess({});
  }

  requestAccessNotion(): RequestAuthSent {
    return this.notionService.RequestAccess({});
  }

  requestAccessTokenNotion(
    data: RequestAccessTokenParams,
  ): RequestAccessTokenSent {
    return this.notionService.RequestAccessToken(data);
  }
}

import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  RequestAuthSent,
  RequestAccessTokenSent,
  RequestAccessTokenParams,
  RegisterParams,
  AccessToken,
  LoginParams,
  AreaParams,
  AvailableArea,
  Service,
  CommitInfo,
  UserId,
  UserAreas,
  UserInfo,
  AvailableAreas,
  Services,
  PullRequestInfo,
  IssueInfo,
  ServicesJsonResponse,
} from './protos/interfaces';
import { lastValueFrom, Observable } from 'rxjs';

interface OAuth2Service {
  RequestAuthorizationGoogle({}): RequestAuthSent;
  RequestAccessTokenGoogle(
    data: RequestAccessTokenParams,
  ): Observable<RequestAccessTokenSent>;
  // RequestAccessGoogleGmail({}): RequestAuthSent;
  RequestAccessSpotify({}): RequestAuthSent;
  RequestAccessTokenSpotify(
    data: RequestAccessTokenParams,
  ): Observable<RequestAccessTokenSent>;
  // ): RequestAccessTokenSent;

  RequestAccessDiscord({}): RequestAuthSent;
  RequestAccessTokenDiscord(
    data: RequestAccessTokenParams,
  ): Observable<RequestAccessTokenSent>;
  LoginWithDiscord({}): Observable<AccessToken>;
  LoginWithGoogle({}): Observable<AccessToken>;
  LoginWithSpotify({}): Observable<AccessToken>;
  RequestAccessGithub({}): RequestAuthSent;
  RequestAccessTokenGithub(
    data: RequestAccessTokenParams,
  ): Observable<RequestAccessTokenSent>;
  LoginWithGithub({}): Observable<AccessToken>;
  RequestAccessNotion({}): RequestAuthSent;
  LoginWithGithub({}): Observable<AccessToken>;
  RequestAccessReddit({}): RequestAuthSent;
  RequestAccessTokenReddit(
    data: RequestAccessTokenParams,
  ): Observable<RequestAccessTokenSent>;
  RequestAccessNotion({}): RequestAuthSent;
  RequestAccessTokenNotion(
    data: RequestAccessTokenParams,
  ): RequestAccessTokenSent;
}

interface UserManagementService {
  Register(data: RegisterParams): AccessToken;
  Login(data: LoginParams): AccessToken;
  GetUserInfo(data: UserId): Observable<UserInfo>;
  Logout({}): Observable<void>;
  DeleteUser(data: UserId): Observable<void>;
}

interface AreasService {
  CreateArea(data: AreaParams): void;
  GetAvailableActionsPerService(data: Service): Observable<AvailableAreas>;
  GetAvailableReactionsPerService(data: Service): Observable<AvailableAreas>;
  GetServices({}): Observable<Services>;
  HandleGithubCommit(data: CommitInfo): Observable<void>;
  HandleGithubPullRequest(data: PullRequestInfo): Observable<void>;
  HandleGithubIssue(data: IssueInfo): Observable<void>;
  GetAreasByUser(data: UserId): Observable<UserAreas>;
  DeleteAllAreas({}): Observable<void>;
  GetServicesInfo({}): Observable<ServicesJsonResponse>;
}

@Injectable()
export class AppService implements OnModuleInit {
  private oauth2Service: OAuth2Service;
  private userManagementService: UserManagementService;
  private areasService: AreasService;

  constructor(
    @Inject('OAUTH2_PACKAGE') private oauth2Client: ClientGrpc,
    @Inject('USER_MANAGEMENT_PACKAGE') private userManagementClient: ClientGrpc,
    @Inject('AREAS_PACKAGE') private areasClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.oauth2Service =
      this.oauth2Client.getService<OAuth2Service>('OAuth2Service');
    this.userManagementService =
      this.userManagementClient.getService<UserManagementService>(
        'UserManagementService',
      );
    this.areasService =
      this.areasClient.getService<AreasService>('AreasService');
  }

  requestAuthorizationGoogle(): RequestAuthSent {
    return this.oauth2Service.RequestAuthorizationGoogle({});
  }

  async requestAccessTokenGoogle(
    data: RequestAccessTokenParams,
  ): Promise<RequestAccessTokenSent> {
    return await lastValueFrom(
      this.oauth2Service.RequestAccessTokenGoogle(data),
    );
  }

  // requestAccessGoogleGmail(): RequestAuthSent {
  //   return this.oauth2Service.RequestAccessGoogleGmail({});
  // }

  requestAccessSpotify(): RequestAuthSent {
    return this.oauth2Service.RequestAccessSpotify({});
  }

  async requestAccessTokenSpotify(
    data: RequestAccessTokenParams,
  ): Promise<RequestAccessTokenSent> {
    return await lastValueFrom(
      this.oauth2Service.RequestAccessTokenSpotify(data),
    );
  }

  requestAccessReddit(): RequestAuthSent {
    return this.oauth2Service.RequestAccessReddit({});
  }

  async requestAccessTokenReddit(
    data: RequestAccessTokenParams,
  ): Promise<RequestAccessTokenSent> {
    return await lastValueFrom(
      this.oauth2Service.RequestAccessTokenReddit(data),
    );
  }

  requestAccessDiscord(): RequestAuthSent {
    return this.oauth2Service.RequestAccessDiscord({});
  }

  async requestAccessTokenDiscord(
    data: RequestAccessTokenParams,
  ): Promise<RequestAccessTokenSent> {
    return await lastValueFrom(
      this.oauth2Service.RequestAccessTokenDiscord(data),
    );
  }

  async loginWithDiscord(): Promise<AccessToken> {
    return await lastValueFrom(this.oauth2Service.LoginWithDiscord({}));
  }

  requestAccessNotion(): RequestAuthSent {
    return this.oauth2Service.RequestAccessNotion({});
  }

  requestAccessTokenNotion(
    data: RequestAccessTokenParams,
  ): RequestAccessTokenSent {
    return this.oauth2Service.RequestAccessTokenNotion(data);
  }

  register(data: RegisterParams): AccessToken {
    return this.userManagementService.Register(data);
  }

  login(data: LoginParams): AccessToken {
    return this.userManagementService.Login(data);
  }

  async loginWithGoogle(): Promise<AccessToken> {
    Logger.debug('IN LOGIN WITH GOOGLEOF API');
    return await lastValueFrom(this.oauth2Service.LoginWithGoogle({}));
  }

  async loginWithSpotify(): Promise<AccessToken> {
    Logger.debug('IN LOGIN WITH SPOTIFY API');
    return await lastValueFrom(this.oauth2Service.LoginWithSpotify({}));
  }

  requestAccessGithub(): RequestAuthSent {
    return this.oauth2Service.RequestAccessGithub({});
  }

  async requestAccessTokenGithub(
    data: RequestAccessTokenParams,
  ): Promise<RequestAccessTokenSent> {
    Logger.debug('NO MICKEY');
    return await lastValueFrom(
      this.oauth2Service.RequestAccessTokenGithub(data),
    );
  }

  async loginWithGithub(): Promise<AccessToken> {
    Logger.debug('IN LOGIN WITH GITHUB API');
    return await lastValueFrom(this.oauth2Service.LoginWithGithub({}));
  }

  createArea(data: AreaParams) {
    return this.areasService.CreateArea(data);
  }

  async getAvailableActionsPerService(data: Service): Promise<AvailableAreas> {
    return await lastValueFrom(
      this.areasService.GetAvailableActionsPerService(data),
    );
  }

  async getAvailableReactionsPerService(
    data: Service,
  ): Promise<AvailableAreas> {
    return await lastValueFrom(
      this.areasService.GetAvailableReactionsPerService(data),
    );
  }

  async getServices({}): Promise<Services> {
    return await lastValueFrom(this.areasService.GetServices({}));
  }

  async handleGithubCommit(data: CommitInfo) {
    return await lastValueFrom(this.areasService.HandleGithubCommit(data));
  }

  async handleGithubPullRequest(data: PullRequestInfo) {
    return await lastValueFrom(this.areasService.HandleGithubPullRequest(data));
  }

  async handleGithubIssue(data: IssueInfo) {
    return await lastValueFrom(this.areasService.HandleGithubIssue(data));
  }

  async getAreasByUser(data: UserId) {
    return await lastValueFrom(this.areasService.GetAreasByUser(data));
  }

  async getUserInfo(data: UserId) {
    return await lastValueFrom(this.userManagementService.GetUserInfo(data));
  }

  async logout() {
    return await lastValueFrom(this.userManagementService.Logout({}));
  }

  async deleteUser(data: UserId) {
    return await lastValueFrom(this.userManagementService.DeleteUser(data));
  }

  async deleteAllAreas() {
    return await lastValueFrom(this.areasService.DeleteAllAreas({}));
  }

  async getServicesInfo(): Promise<ServicesJsonResponse> {
    return await lastValueFrom(this.areasService.GetServicesInfo({}));
  }
}

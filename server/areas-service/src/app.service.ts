import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  RequestAuthSent,
  RequestAccessTokenSent,
  RequestAccessTokenParams,
  SendEmailParams,
  CurrentUserId,
  NewSavedTracks,
  SetTriggerOnRepoParams,
  NewSavedPosts,
  NewUpDownvotedPosts,
  WeatherInParis,
  TimeInParis,
  NameOfGuild,
  DiscordRolesGuild,
  SubmitTextParams,
  SubmitLinkParams,
  SendEmailToYourselfParams,
  DiscordUsername,
  DiscordServicesName,
  NotionTitleBlock,
  NotionNameUser,
  NotionEmailUser,
  NotionLastEditedBlock,
  NotionBlockId,
  NotionChildrenBlock,
  NotionPageId,
  NotionLastEditedPage,
  NotionDatabaseId,
  NotionLastEditedDatabase,
  NotionCommentsInfo,
  NotionNewComment,
  NotionUpdateBlock,
  NotionCreatePage,
  NewLikedVideos,
  NewSubscriptions,
  IslamicPrayerFajrTime,
  IslamicPrayerTime,
  NewSavedShows,
  NewSavedAlbums,
  CreateIssueCommentParams,
  CreateIssueParams,
  IsCheckTrue,
  NotionUpdateDatabase,
  IslamicPrayerDate,
} from './protos/interfaces';
import { last, lastValueFrom, Observable } from 'rxjs';

interface IslamicPrayerService {
  GetFajrTime({}): Observable<IslamicPrayerFajrTime>;
  GetTime({}): Observable<IslamicPrayerTime>;
  GetTimestamp({}): Observable<IslamicPrayerTime>;
  GetDate({}): Observable<IslamicPrayerDate>;
}

interface NotionService {
  PostNewBlock(data: NotionTitleBlock): Observable<void>;
  GetNameUser({}): Observable<NotionNameUser>;
  GetEmailUser({}): Observable<NotionEmailUser>;
  GetOwnerName({}): Observable<NotionNameUser>;
  GetLastEditedBlock(data: NotionBlockId): Observable<NotionLastEditedBlock>;
  GetChildrenBlock(data: NotionBlockId): Observable<NotionChildrenBlock>;
  GetLastEditedPage(data: NotionPageId): Observable<NotionLastEditedPage>;
  GetLastEditedDatabase(
    data: NotionDatabaseId,
  ): Observable<NotionLastEditedDatabase>;
  GetCommentsOnBlock(data: NotionBlockId): Observable<NotionCommentsInfo>;
  PostNewComment(data: NotionNewComment): Observable<void>;
  UpdateBlock(data: NotionUpdateBlock): Observable<void>;
  DeleteBlock(data: NotionBlockId): Observable<void>;
  CreatePage(data: NotionCreatePage): Observable<void>;
  CreateDatabase(data: NotionCreatePage): Observable<void>;
  UpdateDatabaseTitle(data: NotionUpdateDatabase): Observable<void>;
}

interface DiscordService {
  GetGuildsInfo(data: NameOfGuild): Observable<DiscordRolesGuild>;
  GetUsername({}): Observable<DiscordUsername>;
  GetServicesConnected({}): Observable<DiscordServicesName>;
}

interface WeatherTimeService {
  GetTimeInParis({}): Observable<TimeInParis>;
  GetWeatherInParis({}): Observable<WeatherInParis>;
}

interface GoogleService {
  SendEmail(data: SendEmailParams): Observable<void>;
  SendEmailToYourself(data: SendEmailToYourselfParams): Observable<void>;
  GetNbLikedVideos({}): void;
  CheckNewLikedVideos({}): Observable<NewLikedVideos>;
  CheckNewSubscriptions({}): Observable<NewSubscriptions>;
  RefreshToken({}): Observable<void>;
}

interface SpotifyService {
  RequestAccess({}): RequestAuthSent;
  RequestAccessToken(data: RequestAccessTokenParams): RequestAccessTokenSent;
  GetUserSavedTracks({}): void;
  CheckUserSavedTracks({}): Observable<NewSavedTracks>;
  CheckUserSavedShows({}): Observable<NewSavedShows>;
  CheckUserSavedAlbums({}): Observable<NewSavedAlbums>;
  StartResumePlayback({}): Observable<void>;
  PausePlayback({}): Observable<void>;
  SkipToNextMusic({}): Observable<void>;
  RefreshToken({}): Observable<void>;
}

interface UserManagementService {
  GetCurrentUserId({}): Observable<CurrentUserId>;
}

interface GithubService {
  SetTriggerNewCommitRepo(data: SetTriggerOnRepoParams): Observable<void>;
  SetTriggerNewPullRequestRepo(data: SetTriggerOnRepoParams): Observable<void>;
  SetTriggerNewIssueRepo(data: SetTriggerOnRepoParams): Observable<void>;
  CreateIssue(data: CreateIssueParams): Observable<void>;
  CreateIssueComment(data: CreateIssueCommentParams): Observable<void>;
}

interface RedditService {
  CheckUserSavedPosts({}): Observable<NewSavedPosts>;
  CheckUserUpvotedPosts({}): Observable<NewUpDownvotedPosts>;
  CheckUserDownvotedPosts({}): Observable<NewUpDownvotedPosts>;
  SubmitText(data: SubmitTextParams): Observable<void>;
  SubmitLink(data: SubmitLinkParams): Observable<void>;
}

interface CoinFlipService {
  CheckHeads({}): Observable<IsCheckTrue>;
  CheckTails({}): Observable<IsCheckTrue>;
}

@Injectable()
export class AppService implements OnModuleInit {
  private googleService: GoogleService;
  private spotifyService: SpotifyService;
  private userManagementService: UserManagementService;
  private githubService: GithubService;
  private redditService: RedditService;
  private weathertimeService: WeatherTimeService;
  private discordService: DiscordService;
  private coinFlipService: CoinFlipService;
  private notionService: NotionService;
  private islamicPrayerService: IslamicPrayerService;

  constructor(
    @Inject('GOOGLE_PACKAGE') private googleClient: ClientGrpc,
    @Inject('SPOTIFY_PACKAGE') private spotifyClient: ClientGrpc,
    @Inject('USER_MANAGEMENT_PACKAGE') private userManagementClient: ClientGrpc,
    @Inject('GITHUB_PACKAGE') private githubClient: ClientGrpc,
    @Inject('REDDIT_PACKAGE') private redditClient: ClientGrpc,
    @Inject('WEATHER_TIME_PACKAGE') private weathertimeClient: ClientGrpc,
    @Inject('DISCORD_PACKAGE') private discordClient: ClientGrpc,
    @Inject('COINFLIP_PACKAGE') private coinFlipClient: ClientGrpc,
    @Inject('NOTION_PACKAGE') private notionClient: ClientGrpc,
    @Inject('ISLAMIC_PRAYER_PACKAGE') private islamicPrayerClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.googleService =
      this.googleClient.getService<GoogleService>('GoogleService');
    this.spotifyService =
      this.spotifyClient.getService<SpotifyService>('SpotifyService');
    this.userManagementService =
      this.userManagementClient.getService<UserManagementService>(
        'UserManagementService',
      );
    this.githubService =
      this.githubClient.getService<GithubService>('GithubService');
    this.redditService =
      this.redditClient.getService<RedditService>('RedditService');
    this.weathertimeService =
      this.weathertimeClient.getService<WeatherTimeService>(
        'WeatherTimeService',
      );
    this.discordService =
      this.discordClient.getService<DiscordService>('DiscordService');
    this.coinFlipService =
      this.coinFlipClient.getService<CoinFlipService>('CoinFlipService');
    this.notionService =
      this.notionClient.getService<NotionService>('NotionService');
    this.islamicPrayerService =
      this.islamicPrayerClient.getService<IslamicPrayerService>(
        'IslamicPrayerService',
      );
  }

  async getCurrentUserId(): Promise<CurrentUserId> {
    return await lastValueFrom(this.userManagementService.GetCurrentUserId({}));
  }

  async sendEmail(data: SendEmailParams): Promise<void> {
    return await lastValueFrom(this.googleService.SendEmail(data));
  }

  async sendEmailToYourself(data: SendEmailToYourselfParams): Promise<void> {
    return await lastValueFrom(this.googleService.SendEmailToYourself(data));
  }

  requestAccessSpotify(): RequestAuthSent {
    return this.spotifyService.RequestAccess({});
  }

  requestAccessTokenSpotify(
    data: RequestAccessTokenParams,
  ): RequestAccessTokenSent {
    return this.spotifyService.RequestAccessToken(data);
  }

  async checkUserSavedTracks({}): Promise<NewSavedTracks> {
    return await lastValueFrom(this.spotifyService.CheckUserSavedTracks({}));
  }

  async setTriggerNewCommitRepo(data: SetTriggerOnRepoParams) {
    await lastValueFrom(this.githubService.SetTriggerNewCommitRepo(data));
  }

  async checkUserSavedPosts({}): Promise<NewSavedPosts> {
    return await lastValueFrom(this.redditService.CheckUserSavedPosts({}));
  }

  async checkUserUpvotedPosts({}): Promise<NewUpDownvotedPosts> {
    return await lastValueFrom(this.redditService.CheckUserUpvotedPosts({}));
  }

  async checkUserDownvotedPosts({}): Promise<NewUpDownvotedPosts> {
    return await lastValueFrom(this.redditService.CheckUserDownvotedPosts({}));
  }

  async submitText(data: SubmitTextParams): Promise<void> {
    return await lastValueFrom(this.redditService.SubmitText(data));
  }

  async submitLink(data: SubmitLinkParams): Promise<void> {
    return await lastValueFrom(this.redditService.SubmitLink(data));
  }

  async getTimeInParis({}): Promise<TimeInParis> {
    const t = await lastValueFrom(this.weathertimeService.GetTimeInParis({}));
    return t;
  }

  async getWeatherInParis({}): Promise<WeatherInParis> {
    return await lastValueFrom(this.weathertimeService.GetWeatherInParis({}));
  }

  async getGuildsInfo(data: NameOfGuild): Promise<DiscordRolesGuild> {
    return await lastValueFrom(this.discordService.GetGuildsInfo(data));
  }

  async checkNewLikedVideos({}): Promise<NewLikedVideos> {
    // Logger.debug('BELLA QUESTA');
    return await lastValueFrom(this.googleService.CheckNewLikedVideos({}));
  }

  async checkNewSubscriptions({}): Promise<NewSubscriptions> {
    // Logger.debug('BELLA QUESTA');
    return await lastValueFrom(this.googleService.CheckNewSubscriptions({}));
  }

  async getDiscordUsername(): Promise<DiscordUsername> {
    return await lastValueFrom(this.discordService.GetUsername({}));
  }

  async getDiscordConnectedServices(): Promise<DiscordServicesName> {
    return await lastValueFrom(this.discordService.GetServicesConnected({}));
  }

  async notionPostNewBlock(data: NotionTitleBlock) {
    return await lastValueFrom(this.notionService.PostNewBlock(data));
  }

  async notionGetNameUser(): Promise<NotionNameUser> {
    return await lastValueFrom(this.notionService.GetNameUser({}));
  }

  async notionGetEmailUser(): Promise<NotionEmailUser> {
    return await lastValueFrom(this.notionService.GetEmailUser({}));
  }

  async notionGetOwnerName(): Promise<NotionNameUser> {
    return await lastValueFrom(this.notionService.GetOwnerName({}));
  }

  async notionGetLastEditedBlock(
    data: NotionBlockId,
  ): Promise<NotionLastEditedBlock> {
    return await lastValueFrom(this.notionService.GetLastEditedBlock(data));
  }

  async notionGetChildrenBlock(
    data: NotionBlockId,
  ): Promise<NotionChildrenBlock> {
    return await lastValueFrom(this.notionService.GetChildrenBlock(data));
  }

  async notionGetLastEditedPage(
    data: NotionPageId,
  ): Promise<NotionLastEditedPage> {
    return await lastValueFrom(this.notionService.GetLastEditedPage(data));
  }

  async notionGetLastEditedDatabase(
    data: NotionDatabaseId,
  ): Promise<NotionLastEditedDatabase> {
    return await lastValueFrom(this.notionService.GetLastEditedDatabase(data));
  }

  async notionGetCommentsOnBlock(
    data: NotionBlockId,
  ): Promise<NotionCommentsInfo> {
    return await lastValueFrom(this.notionService.GetCommentsOnBlock(data));
  }

  async notionPostNewComment(data: NotionNewComment) {
    return await lastValueFrom(this.notionService.PostNewComment(data));
  }

  async notionUpdateBlock(data: NotionUpdateBlock) {
    return await lastValueFrom(this.notionService.UpdateBlock(data));
  }

  async notionDeleteBlock(data: NotionBlockId) {
    return await lastValueFrom(this.notionService.DeleteBlock(data));
  }

  async notionCreatePage(data: NotionCreatePage) {
    return await lastValueFrom(this.notionService.CreatePage(data));
  }

  async notionCreateDatabase(data: NotionCreatePage) {
    return await lastValueFrom(this.notionService.CreateDatabase(data));
  }

  async notionUpdateDatabaseTitle(data: NotionUpdateDatabase) {
    return await lastValueFrom(this.notionService.UpdateDatabaseTitle(data));
  }

  async islamicPrayerGetFajrTime() {
    return await lastValueFrom(this.islamicPrayerService.GetFajrTime({}));
  }

  async islamicPrayerGetTime() {
    return await lastValueFrom(this.islamicPrayerService.GetTime({}));
  }

  async islamicPrayerGetTimestamp() {
    return await lastValueFrom(this.islamicPrayerService.GetTimestamp({}));
  }

  async islamicPrayerGetDate() {
    return await lastValueFrom(this.islamicPrayerService.GetDate({}));
  }

  async checkUserSavedShows({}): Promise<NewSavedShows> {
    return await lastValueFrom(this.spotifyService.CheckUserSavedShows({}));
  }

  async checkUserSavedAlbums({}): Promise<NewSavedAlbums> {
    return await lastValueFrom(this.spotifyService.CheckUserSavedAlbums({}));
  }

  async startResumePlayback({}): Promise<void> {
    return await lastValueFrom(this.spotifyService.StartResumePlayback({}));
  }

  async pausePlayback({}): Promise<void> {
    return await lastValueFrom(this.spotifyService.PausePlayback({}));
  }

  async skipToNextMusic({}): Promise<void> {
    return await lastValueFrom(this.spotifyService.SkipToNextMusic({}));
  }

  async setTriggerNewPullRequestRepo(data: SetTriggerOnRepoParams) {
    await lastValueFrom(this.githubService.SetTriggerNewPullRequestRepo(data));
  }

  async setTriggerNewIssueRepo(data: SetTriggerOnRepoParams) {
    await lastValueFrom(this.githubService.SetTriggerNewIssueRepo(data));
  }

  async createIssue(data: CreateIssueParams) {
    await lastValueFrom(this.githubService.CreateIssue(data));
  }

  async createIssueComment(data: CreateIssueCommentParams) {
    await lastValueFrom(this.githubService.CreateIssueComment(data));
  }

  async checkHeads({}): Promise<IsCheckTrue> {
    return await lastValueFrom(this.coinFlipService.CheckHeads({}));
  }

  async checkTails({}): Promise<IsCheckTrue> {
    return await lastValueFrom(this.coinFlipService.CheckTails({}));
  }

  async refreshTokenSpotify({}): Promise<void> {
    return await lastValueFrom(this.spotifyService.RefreshToken({}));
  }

  async refreshTokenGoogle({}): Promise<void> {
    return await lastValueFrom(this.googleService.RefreshToken({}));
  }
}

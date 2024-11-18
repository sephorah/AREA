export interface RequestAuthSent {
  url: string;
}

export interface RequestAccessTokenParams {
  code: string;
}

export interface RequestAccessTokenSent {
  accessToken: string;
  tokenType: string;
}

export interface AccessToken {
  accessToken: string;
  userId: string;
}
export interface SendEmailParams {
  recipient: string;
  subject: string;
  body: string;
}

export interface AreaParams {
  action: string;
  reaction: string;
  ownerId: string;
  actionParams: string;
  reactionParams: string;
}

export type ReactionParams = Pick<AreaParams, 'reactionParams' | 'ownerId'>;

export interface UserParams {
  username: string;
  accessToken: string;
}

export interface CreateAccessTokenParams {
  spotify: string;
  google: string;
  ownerId: string;
}

export interface CurrentUserId {
  userId: string;
}

export interface AvailableArea {
  name: string;
  service: string;
  params: string[];
  enDescription: string;
  frDescription: string;
}

export interface AvailableAreas {
  areas: AvailableArea[];
}

export interface Services {
  services: Service[];
}

export interface Service {
  name: string;
}

export interface NewSavedTrack {
  trackName: string;
  trackURL: string;
  artistName: string;
  albumName: string;
  savedAt: string;
  trackId: string;
  trackIsrc: string;
}

export interface NewSavedTracks {
  newSavedTracks: NewSavedTrack[];
}

export interface SetTriggerOnRepoParams {
  owner: string;
  repoName: string;
}

export interface CommitInfo {
  authorUsername: string;
  authorEmail: string;
  commitMessage: string;
  commitUrl: string;
  commitTimestamp: string;
  repoName: string;
  repoUrl: string;
}

export interface NewSavedPost {
  titlePost: string;
  postURL: string;
  subreddit: string;
  postedAt: string;
}

export interface NewSavedPosts {
  newSavedPosts: NewSavedPost[];
}

export interface NewUpDownvotedPost {
  titlePost: string;
  postURL: string;
  subreddit: string;
  postedAt: string;
}

export interface NewUpDownvotedPosts {
  newUpDownvotedPosts: NewUpDownvotedPost[];
}

export interface UserId {
  userId: string;
}

export interface UserArea {
  id: string;
  ownerId: string;
  action: string;
  reaction: string;
  actionParams: string;
  reactionParams: string;
  descriptionEnAction: string;
  descriptionFrAction: string;
  descriptionEnReaction: string;
  descriptionFrReaction: string;
}

export interface UserAreas {
  areas: UserArea[];
}

export interface TimeInParis {
  time: string;
}

export interface WeatherInParis {
  weather: string;
}

export interface DiscordRolesGuild {
  roles: string[];
}

export interface NameOfGuild {
  name: string;
}

export interface DiscordUsername {
  username: string
}

export interface DiscordServicesName {
  listOfServices: string[]
}

export interface SubmitTextParams {
  subreddit: string;
  title: string;
  text: string;
}

export interface HandleEmailReactionParams {
  body: string;
  reaction: string;
  reactionParams: string;
  ownerId: string;
}

export interface HandleSubmitText {
  title: string;
  text: string;
  reaction: string;
  reactionParams: string;
  ownerId: string;
}

export interface HandleCreateIssue {
  title: string;
  body: string;
  reaction: string;
  reactionParams: string;
  ownerId: string;
}

export interface HandleCreateIssueComment {
  body: string;
  reaction: string;
  reactionParams: string;
  ownerId: string;
}

export interface SubmitLinkParams {
  subreddit: string;
  title: string;
  text: string;
  url: string;
}

export interface HandleSubmitLink {
  title: string;
  text: string;
  reaction: string;
  reactionParams: string;
  ownerId: string;
  url: string;
}

export interface SendEmailToYourselfParams {
  subject: string;
  body: string;
}

export interface NotionTitleBlock {
  text: string;
  pageId: string;
}

export interface NotionNameUser {
  name: string;
}

export interface NotionEmailUser {
  email: string;
}

export interface NotionBlockId {
  blockId: string;
}

export interface NotionLastEditedBlock {
  date: string;
  editorsName: string;
}

export interface NotionChildrenBlock {
  childrenNbr: string;
  editorsName: string;
}

export interface NotionPageId {
  pageId: string;
}

export interface NotionLastEditedPage {
  date: string;
  editorsName: string;
}

export interface NotionDatabaseId {
  databaseId: string;
}

export interface NotionLastEditedDatabase {
  date: string;
  editorsName: string;
}

export interface NotionCommentsInfo {
  nbrOfComments: string;
  blockId: string;
}

export interface NotionNewComment {
  pageId: string;
  text: string;
}

export interface NotionUpdateBlock {
  blockId: string;
  text: string;
}

export interface NotionCreatePage {
  pageId: string;
  title: string;
}
export interface TimeInParis {
  time: string;
}

export interface NewLikedVideos {
  newLikedVideos: NewLikedVideo[];
}

export interface NewLikedVideo {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  channel: string;
}

export interface NewSubscriptions {
  newSubscriptions: NewSubscription[];
}

export interface NewSubscription {
  title: string;
  description: string;
  url: string;
}

export interface IslamicPrayerFajrTime {
  fajr: string
}

export interface IslamicPrayerTime {
  time: string
}

export interface IslamicPrayerDate {
  date: string
}

export interface NewSavedShow {
  name: string;
  description: string;
  publisher: string;
  url: string;
  savedAt: string;
}

export interface NewSavedShows {
  newSavedShows: NewSavedShow[];
}

export interface NewSavedAlbum {
  name: string;
  artists: string;
  url: string;
  savedAt: string;
}

export interface NewSavedAlbums {
  newSavedAlbums: NewSavedAlbum[];
}

export interface PullRequestInfo {
  title: string;
  body: string;
  repoName: string;
  authorUsername: string;
  url: string;
  createdAt: string;
}

export interface IssueInfo {
  title: string;
  body: string;
  issueLabels: string[];
  url: string;
  createdAt: string;
  authorUsername: string;
  repoName: string;
}

export interface CreateIssueParams {
  owner: string;
  repoName: string;
  title: string;
  body: string;
}

export interface CreateIssueCommentParams {
  owner: string;
  repoName: string;
  issueNumber: string;
  body: string;
}

export interface IsCheckTrue {
  check: boolean;
}

export interface ServicesJsonResponse {
  services: ServiceInfo[];
}

export interface ServiceInfo {
  name: string;
  actions: AreaInfo[];
  reactions: AreaInfo[];
}

export interface AreaInfo {
  name: string;
  description: string;
}
export interface NotionUpdateDatabase {
  databaseId: string;
  title: string;
}

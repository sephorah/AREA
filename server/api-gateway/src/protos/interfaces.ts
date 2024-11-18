export interface RequestAuthSent {
  url: string;
}

export interface RequestAccessTokenParams {
  code: string;
  userId?: string;
}

export interface RequestAccessTokenSent {
  accessToken: string;
  tokenType: string;
}

export interface RegisterParams {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface LoginParams {
  username: string;
  password: string;
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

export interface CommitInfo {
  authorUsername: string;
  authorEmail: string;
  commitMessage: string;
  commitUrl: string;
  commitTimestamp: string;
  repoName: string;
  repoUrl: string;
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

export interface UserInfo {
  email: string;
  username: string;
  password: string;
  provider: string;
  pictureURL: string;
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

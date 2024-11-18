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

export interface SendEmailToYourselfParams {
  subject: string;
  body: string;
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

export interface LoginProviderParams {
  username: string;
  email: string;
  provider: string;
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

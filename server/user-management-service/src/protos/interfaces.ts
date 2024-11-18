export interface RegisterParams {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface AccessToken {
  accessToken: string;
  userId: string;
}

export interface LoginParams {
  username: string;
  password: string;
}

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

export interface SendEmailParams {
  recipient: string;
  subject: string;
  body: string;
}

export interface CurrentUserId {
  userId: string;
}

export interface LoginProviderParams {
  username: string;
  email: string;
  provider: string;
}

export interface UserId {
  userId: string;
}

export interface UserInfo {
  email: string;
  username: string;
  password: string;
  provider: string;
  pictureURL: string;
}

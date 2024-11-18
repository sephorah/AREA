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

export interface DiscordRolesGuild {
  roles: string[]
}

export interface DiscordUsername {
  username: string
}

export interface DiscordServicesName {
  listOfServices: string[]
}

export interface NameOfGuild {
  name: string;
}

export interface AccessToken {
  accessToken: string;
  userId: string;
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

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

export interface SendEmailParams {
  recipient: string;
  subject: string;
  body: string;
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

export interface AccessToken {
  accessToken: string;
  userId: string;
}

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

export interface LoginProviderParams {
  username: string;
  email: string;
  provider: string;
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

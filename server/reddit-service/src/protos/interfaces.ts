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

export interface SubmitTextParams {
  subreddit: string;
  title: string;
  text: string;
}

export interface SubmitLinkParams {
  subreddit: string;
  title: string;
  text: string;
  url: string;
}

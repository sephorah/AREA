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

export interface CommitInfo {
  authorUsername: string;
  authorEmail: string;
  commitMessage: string;
  commitUrl: string;
  commitTimestamp: string;
  repoName: string;
  repoUrl: string;
}

export interface SetTriggerOnRepoParams {
  owner: string;
  repoName: string;
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

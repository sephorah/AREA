import { Injectable, Logger } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { CommitInfo, IssueInfo, PullRequestInfo } from 'src/protos/interfaces';

@Injectable()
export class GithubWebhooksService {
  constructor(private readonly appService: AppService) {}

  async handleGithubEvents(event: any): Promise<void> {
    Logger.debug('IN HANDLE GITHUB EVENTS');

    // Logger.debug('EVENT', event);
    if (event.head_commit && event.repository) {
      const commitInfo: CommitInfo = {
        authorUsername: event.head_commit.author.username,
        authorEmail: event.head_commit.author.email,
        commitMessage: event.head_commit.message,
        commitUrl: event.head_commit.url,
        commitTimestamp: event.head_commit.timestamp,
        repoName: event.repository.name,
        repoUrl: event.repository.html_url,
      };
      Logger.debug('COMMIT INFO FROM WEBHOOK', JSON.stringify(commitInfo));
      return await this.appService.handleGithubCommit(commitInfo);
    }
    if (event.action == 'opened' && event.pull_request && event.repository) {
      const pullRequestInfo: PullRequestInfo = {
        title: event.pull_request.title,
        body: event.pull_request.body ? event.pull_request.body : '',
        repoName: event.repository.name,
        authorUsername: event.pull_request.user.login,
        url: event.pull_request.html_url,
        createdAt: event.pull_request.created_at,
      };
      Logger.debug('PULL REQ INFO', JSON.stringify(pullRequestInfo));
      return await this.appService.handleGithubPullRequest(pullRequestInfo);
    }
    if (event.action == 'opened' && event.issue && event.repository) {
      const issueInfo: IssueInfo = {
        title: event.issue.title,
        body: event.issue.body ? event.issue.body : '',
        issueLabels: event.issue.labels.map((label) => label.name),
        url: event.issue.html_url,
        createdAt: event.issue.created_at,
        authorUsername: event.issue.user.login,
        repoName: event.repository.name,
      };
      Logger.debug('ISSUE INFO ', JSON.stringify(issueInfo));
      return await this.appService.handleGithubIssue(issueInfo);
    }
  }
}

import { Controller, Inject, Logger } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import {
  CreateIssueCommentParams,
  CreateIssueParams,
} from '../protos/interfaces';
import axios from 'axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller('')
export class GithubReactionsController {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  @GrpcMethod('GithubService', 'CreateIssue')
  async createIssue({ owner, repoName, title, body }: CreateIssueParams) {
    const accessToken = await this.cacheManager.get('githubToken');
    const url = `https://api.github.com/repos/${owner}/${repoName}/issues`;

    Logger.debug('CREATE ISSUE', repoName, owner, title, body);
    try {
      await axios.post(
        url,
        {
          title: title,
          body: body,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/vnd.github+json',
          },
        },
      );
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('GithubService', 'CreateIssueComment')
  async createIssueComment({
    owner,
    repoName,
    issueNumber,
    body,
  }: CreateIssueCommentParams) {
    const accessToken = await this.cacheManager.get('githubToken');
    const url = `https://api.github.com/repos/${owner}/${repoName}/issues/${issueNumber}/comments`;

    Logger.debug('CREATE ISSUE COMMENT', issueNumber, repoName, owner, body);
    try {
      await axios.post(
        url,
        {
          body: body,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }
}

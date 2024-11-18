import { Controller, Inject, Logger } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import axios from 'axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AppService } from 'src/app.service';
import constants from 'src/constants';
import { SetTriggerOnRepoParams } from 'src/protos/interfaces';

@Controller('')
export class WebhooksController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly appService: AppService,
  ) {}

  @GrpcMethod('GithubService', 'SetTriggerNewCommitRepo')
  async setTriggerNewCommitRepo({ owner, repoName }: SetTriggerOnRepoParams) {
    const webhookUrl = constants().webhookUrl;
    const accessToken = await this.cacheManager.get('githubToken');
    const createWebhookUrl = `https://api.github.com/repos/${owner}/${repoName}/hooks`;
    const config = {
      name: 'web',
      active: true,
      events: ['push'],
      config: {
        url: webhookUrl,
        content_type: 'json',
        insecure_ssl: '0',
      },
    };
    Logger.debug('SETTING TRIGGER NEW COMMIT');
    try {
      const createdWebhookStatus = (
        await axios.post(createWebhookUrl, config, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        })
      ).status;
      if (createdWebhookStatus != 201) {
        throw new RpcException(
          `Trigger for new commits on repo ${repoName} has not been set`,
        );
      }
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('GithubService', 'SetTriggerNewPullRequestRepo')
  async setTriggerNewPullRequestRepo({
    owner,
    repoName,
  }: SetTriggerOnRepoParams) {
    const webhookUrl = constants().webhookUrl;
    const accessToken = await this.cacheManager.get('githubToken');
    const createWebhookUrl = `https://api.github.com/repos/${owner}/${repoName}/hooks`;
    const config = {
      name: 'web',
      active: true,
      events: ['pull_request'],
      config: {
        url: webhookUrl,
        content_type: 'json',
        insecure_ssl: '0',
      },
    };
    Logger.debug('SETTING TRIGGER NEW PULL REQUEST');
    try {
      const createdWebhookStatus = (
        await axios.post(createWebhookUrl, config, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        })
      ).status;
      if (createdWebhookStatus != 201) {
        throw new RpcException(
          `Trigger for new pull requests on repo ${repoName} has not been set`,
        );
      }
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('GithubService', 'SetTriggerNewIssueRepo')
  async setTriggerNewIssueRepo({ owner, repoName }: SetTriggerOnRepoParams) {
    const webhookUrl = constants().webhookUrl;
    const accessToken = await this.cacheManager.get('githubToken');
    const createWebhookUrl = `https://api.github.com/repos/${owner}/${repoName}/hooks`;
    const config = {
      name: 'web',
      active: true,
      events: ['issues'],
      config: {
        url: webhookUrl,
        content_type: 'json',
        insecure_ssl: '0',
      },
    };
    Logger.debug('SETTING TRIGGER NEW ISSUE');
    try {
      const createdWebhookStatus = (
        await axios.post(createWebhookUrl, config, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        })
      ).status;
      if (createdWebhookStatus != 201) {
        throw new RpcException(
          `Trigger for new issue on repo ${repoName} has not been set`,
        );
      }
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }
}

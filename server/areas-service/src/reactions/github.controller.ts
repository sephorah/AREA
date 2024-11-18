import { Controller, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { AreasService } from '../areas/areas.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { AppService } from 'src/app.service';
import { REACTION } from 'src/avaliable-areas';
import { ReactionParams } from 'src/protos/interfaces';

@Controller('')
export class GithubReactionsController {
  constructor(
    private eventEmitter: EventEmitter2,
    private readonly appService: AppService,
    private readonly areasService: AreasService,
  ) {}

  @OnEvent(REACTION.GITHUB_CREATE_ISSUE)
  async createIssue(reaction: ReactionParams) {
    try {
      const params = JSON.parse(reaction.reactionParams);
      Logger.debug('PARAMS IN CREATING ISSUE', params);
      this.appService.createIssue({
        title: params.title,
        body: params.body,
        repoName: params.repoName,
        owner: params.owner,
      });
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  @OnEvent(REACTION.GITHUB_CREATE_ISSUE_COMMENT)
  async createIssueComment(reaction: ReactionParams) {
    try {
      const params = JSON.parse(reaction.reactionParams);
      this.appService.createIssueComment({
        issueNumber: params.issueNumber,
        body: params.body,
        repoName: params.repoName,
        owner: params.owner,
      });
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }
}

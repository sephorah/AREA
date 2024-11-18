import { Controller, Inject, Logger } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import {
  AreaParams,
  CommitInfo,
  HandleCreateIssue,
  HandleCreateIssueComment,
  HandleSubmitLink,
  HandleSubmitText,
  IssueInfo,
  PullRequestInfo,
} from 'src/protos/interfaces';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AppService } from 'src/app.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AreasService } from 'src/areas/areas.service';
import { ACTION, REACTION } from 'src/avaliable-areas';
import { getFormattedDate } from 'src/utils';

@Controller('')
export class GithubActionsController {
  constructor(
    private eventEmitter: EventEmitter2,
    private readonly appService: AppService,
    private readonly areasService: AreasService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  handleCreateIssueReaction({
    body,
    title,
    reaction,
    reactionParams,
    ownerId,
  }: HandleCreateIssue) {
    const oldReactionParams = JSON.parse(JSON.parse(reactionParams));
    const newReactionParams = JSON.stringify({
      repoName: oldReactionParams.repoName,
      owner: oldReactionParams.owner,
      title: title,
      body: body,
    });
    this.eventEmitter.emit(reaction, {
      reactionParams: newReactionParams,
      ownerId: ownerId,
    });
  }

  handleCreateIssueCommentReaction({
    body,
    reaction,
    reactionParams,
    ownerId,
  }: HandleCreateIssueComment) {
    const oldReactionParams = JSON.parse(JSON.parse(reactionParams));
    const newReactionParams = JSON.stringify({
      repoName: oldReactionParams.repoName,
      owner: oldReactionParams.owner,
      issueNumber: oldReactionParams.issueNumber,
      body: body,
    });
    this.eventEmitter.emit(reaction, {
      reactionParams: newReactionParams,
      ownerId: ownerId,
    });
  }

  handleSubmitTextReaction({
    title,
    text,
    reaction,
    reactionParams,
    ownerId,
  }: HandleSubmitText) {
    const oldReactionParams = JSON.parse(JSON.parse(reactionParams));
    const newReactionParams = JSON.stringify({
      subreddit: oldReactionParams.subreddit,
      title: title,
      text: text,
    });
    Logger.debug('SHEESH', oldReactionParams, typeof oldReactionParams);
    Logger.debug('HI WHATSAPP', newReactionParams);
    this.eventEmitter.emit(reaction, {
      reactionParams: newReactionParams,
      ownerId: ownerId,
    });
  }

  handleSubmitLinkReaction({
    title,
    text,
    reaction,
    reactionParams,
    ownerId,
    url,
  }: HandleSubmitLink) {
    const oldReactionParams = JSON.parse(JSON.parse(reactionParams));
    const newReactionParams = JSON.stringify({
      subreddit: oldReactionParams.subreddit,
      url: url,
      title: title,
      text: text,
    });
    Logger.debug('NEW REACT LINK REDDITT', newReactionParams);
    this.eventEmitter.emit(reaction, {
      reactionParams: newReactionParams,
      ownerId: ownerId,
    });
  }

  handleNewBlock({
    text,
    reaction,
    reactionParams,
    ownerId,
  }: {
    text: string;
    reaction: string;
    reactionParams: string;
    ownerId: string;
  }) {
    const oldReactionParams = JSON.parse(reactionParams);
    const newReactionParams = JSON.stringify({
      text: text,
      pageId: oldReactionParams.pageId,
    });
    this.eventEmitter.emit(reaction, {
      reactionParams: newReactionParams,
      ownerId: ownerId,
    });
  }

  handleNewComment({
    text,
    reaction,
    reactionParams,
    ownerId,
  }: {
    text: string;
    reaction: string;
    reactionParams: string;
    ownerId: string;
  }) {
    const oldReactionParams = JSON.parse(reactionParams);
    const newReactionParams = JSON.stringify({
      text: text,
      pageId: oldReactionParams.pageId,
    });
    this.eventEmitter.emit(reaction, {
      reactionParams: newReactionParams,
      ownerId: ownerId,
    });
  }

  handleUpdateBlock({
    text,
    reaction,
    reactionParams,
    ownerId,
  }: {
    text: string;
    reaction: string;
    reactionParams: string;
    ownerId: string;
  }) {
    const oldReactionParams = JSON.parse(reactionParams);
    const newReactionParams = JSON.stringify({
      text: text,
      blockId: oldReactionParams.blockId,
    });
    this.eventEmitter.emit(reaction, {
      reactionParams: newReactionParams,
      ownerId: ownerId,
    });
  }

  @GrpcMethod('AreasService', 'HandleGithubCommit')
  async handleGithubCommit(data: CommitInfo) {
    try {
      const currentUserId: string = await this.cacheManager.get('currentUser');
      const githubLogin: string = await this.cacheManager.get('githubLogin');

      if (!currentUserId) {
        throw new RpcException('Current user is not defined');
      }
      if (!githubLogin) {
        throw new RpcException('Github login is not defined');
      }
      Logger.debug('HANDLE GITHUB COMMIT');
      const userAreas = await this.areasService.getAreasByOwner(currentUserId);
      const relatedArea = userAreas.find((area) => {
        const actionParams = JSON.parse(area.actionParams as string);

        return (
          area.action == ACTION.GITHUB_NEW_COMMIT_REPO &&
          actionParams.owner == githubLogin &&
          actionParams.repoName == data.repoName
        );
      });

      if (
        relatedArea.reaction == REACTION.GMAIL_SEND_EMAIL ||
        relatedArea.reaction == REACTION.GMAIL_SEND_EMAIL_TO_YOURSELF
      ) {
        Logger.debug('GMAIL REACTION');
        const reactionParams = JSON.parse(relatedArea.reactionParams as string);
        const commitDate = getFormattedDate(new Date(data.commitTimestamp));
        const body = `${data.commitMessage}\nBy ${data.authorUsername}\nOn ${commitDate}\nvia Github ${data.commitUrl}\n\n`;
        const newReactionParams = JSON.stringify({
          body: body,
          recipient: reactionParams.recipient,
          subject: `${data.authorUsername} pushed a commit ${data.commitMessage}`,
        });
        this.eventEmitter.emit(relatedArea.reaction, {
          reactionParams: newReactionParams,
          ownerId: currentUserId,
        });
      }
      if (relatedArea.reaction == REACTION.REDDIT_SUBMIT_TEXT) {
        this.handleSubmitTextReaction({
          title: `${data.authorUsername} pushed a new commit ${data.commitMessage}`,
          text: `At ${getFormattedDate(new Date(data.commitTimestamp))}`,
          reaction: relatedArea.reaction,
          reactionParams: JSON.stringify(relatedArea.reactionParams),
          ownerId: relatedArea.ownerId,
        });
      }
      if (relatedArea.reaction == REACTION.REDDIT_SUBMIT_LINK) {
        this.handleSubmitLinkReaction({
          title: `${data.authorUsername} pushed a new commit ${data.commitMessage}`,
          text: `At ${getFormattedDate(new Date(data.commitTimestamp))}`,
          reaction: relatedArea.reaction,
          reactionParams: JSON.stringify(relatedArea.reactionParams),
          ownerId: relatedArea.ownerId,
          url: data.commitUrl,
        });
      }
      if (
        relatedArea.reaction == REACTION.SPOTIFY_PAUSE_PLAYBACK ||
        relatedArea.reaction == REACTION.SPOTIFY_SKIP_TO_NEXT_MUSIC ||
        relatedArea.reaction == REACTION.SPOTIFY_START_RESUME_PLAYBACK
      ) {
        this.eventEmitter.emit(relatedArea.reaction);
      }
      if (relatedArea.reaction == REACTION.GITHUB_CREATE_ISSUE) {
        this.handleCreateIssueReaction({
          title: `${data.authorUsername} pushed a new commit ${data.commitMessage}`,
          body: `At ${getFormattedDate(new Date(data.commitTimestamp))}\n${data.commitUrl}`,
          reaction: relatedArea.reaction,
          reactionParams: JSON.stringify(relatedArea.reactionParams),
          ownerId: relatedArea.ownerId,
        });
      }
      if (relatedArea.reaction == REACTION.GITHUB_CREATE_ISSUE_COMMENT) {
        this.handleCreateIssueCommentReaction({
          body: `${data.authorUsername} pushed a new commit ${data.commitMessage} at ${getFormattedDate(new Date(data.commitTimestamp))}\n${data.commitUrl}`,
          reaction: relatedArea.reaction,
          reactionParams: JSON.stringify(relatedArea.reactionParams),
          ownerId: relatedArea.ownerId,
        });
      }
      if (relatedArea.reaction == REACTION.NOTION_POST_NEW_BLOCK) {
        this.handleUpdateBlock({
          text: `${data.authorUsername} pushed a new commit ${data.commitMessage} at ${getFormattedDate(new Date(data.commitTimestamp))}\n${data.commitUrl}`,
          reaction: relatedArea.reaction,
          reactionParams: JSON.stringify(relatedArea.reactionParams),
          ownerId: relatedArea.ownerId,
        });
      }
      if (relatedArea.reaction == REACTION.NOTION_POST_NEW_COMMENT) {
        this.handleNewComment({
          text: `${data.authorUsername} pushed a new commit ${data.commitMessage} at ${getFormattedDate(new Date(data.commitTimestamp))}\n${data.commitUrl}`,
          reaction: relatedArea.reaction,
          reactionParams: JSON.stringify(relatedArea.reactionParams),
          ownerId: relatedArea.ownerId,
        });
      }
      if (relatedArea.reaction == REACTION.NOTION_UPDATE_BLOCK) {
        this.handleUpdateBlock({
          text: `${data.authorUsername} pushed a new commit ${data.commitMessage} at ${getFormattedDate(new Date(data.commitTimestamp))}\n${data.commitUrl}`,
          reaction: relatedArea.reaction,
          reactionParams: JSON.stringify(relatedArea.reactionParams),
          ownerId: relatedArea.ownerId,
        });
      }
      if (relatedArea.reaction == REACTION.NOTION_DELETE_BLOCK) {
        this.eventEmitter.emit(relatedArea.reaction, {
          reactionParams: relatedArea.reactionParams,
          ownerId: relatedArea.ownerId,
        });
      }
      if (
        relatedArea.reaction == REACTION.NOTION_CREATE_PAGE ||
        REACTION.NOTION_CREATE_DATABASE ||
        REACTION.NOTION_UPDATE_DATABASE_TITLE
      ) {
        this.eventEmitter.emit(relatedArea.reaction, {
          reactionParams: relatedArea.reactionParams,
          ownerId: relatedArea.ownerId,
        });
      }
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('AreasService', 'HandleGithubPullRequest')
  async handleGithubPullRequest(data: PullRequestInfo) {
    try {
      const currentUserId: string = await this.cacheManager.get('currentUser');
      const githubLogin: string = await this.cacheManager.get('githubLogin');

      if (!currentUserId) {
        throw new RpcException('Current user is not defined');
      }
      if (!githubLogin) {
        throw new RpcException('Github login is not defined');
      }
      Logger.debug('HANDLE GITHUB PULL REQ');
      const userAreas = await this.areasService.getAreasByOwner(currentUserId);
      const relatedArea = userAreas.find((area) => {
        const actionParams = JSON.parse(area.actionParams as string);
        // Logger.debug('HERE THERE ', actionParams, typeof actionParams);
        // Logger.debug('OWNER ', actionParams.owner);
        // Logger.debug('WANTED VALUES', githubLogin, data.repoName);
        // Logger.debug('ACTION THERE', area.action);
        return (
          area.action == ACTION.GITHUB_NEW_PULL_REQUEST_REPO &&
          actionParams.owner == githubLogin &&
          actionParams.repoName == data.repoName
        );
      });

      // Logger.debug('GET RELATED AREA', JSON.stringify(relatedArea));
      if (
        relatedArea.reaction == REACTION.GMAIL_SEND_EMAIL ||
        relatedArea.reaction == REACTION.GMAIL_SEND_EMAIL_TO_YOURSELF
      ) {
        Logger.debug('GMAIL REACTION');
        const reactionParams = JSON.parse(relatedArea.reactionParams as string);
        const pullRequestDate = getFormattedDate(new Date(data.createdAt));
        const body = `By ${data.authorUsername}\n"${data.body}"\nOn ${pullRequestDate}\nVia Github ${data.url}`;
        const newReactionParams = JSON.stringify({
          body: body,
          recipient: reactionParams.recipient,
          subject: `Pull request [${data.repoName}] ${data.title}`,
        });
        this.eventEmitter.emit(relatedArea.reaction, {
          reactionParams: newReactionParams,
          ownerId: currentUserId,
        });
      }
      if (relatedArea.reaction == REACTION.REDDIT_SUBMIT_TEXT) {
        const pullRequestDate = getFormattedDate(new Date(data.createdAt));
        this.handleSubmitTextReaction({
          title: `Pull request [${data.repoName}] ${data.title}`,
          text: `By ${data.authorUsername}\n"${data.body}"\nOn ${pullRequestDate}\nVia Github ${data.url}`,
          reaction: relatedArea.reaction,
          reactionParams: JSON.stringify(relatedArea.reactionParams),
          ownerId: relatedArea.ownerId,
        });
      }
      if (relatedArea.reaction == REACTION.REDDIT_SUBMIT_LINK) {
        const pullRequestDate = getFormattedDate(new Date(data.createdAt));
        this.handleSubmitLinkReaction({
          title: `Pull request [${data.repoName}] ${data.title}`,
          text: `By ${data.authorUsername}\n"${data.body}"\nOn ${pullRequestDate}\nVia Github`,
          reaction: relatedArea.reaction,
          reactionParams: JSON.stringify(relatedArea.reactionParams),
          ownerId: relatedArea.ownerId,
          url: data.url,
        });
      }
      if (
        relatedArea.reaction == REACTION.SPOTIFY_PAUSE_PLAYBACK ||
        relatedArea.reaction == REACTION.SPOTIFY_SKIP_TO_NEXT_MUSIC ||
        relatedArea.reaction == REACTION.SPOTIFY_START_RESUME_PLAYBACK
      ) {
        this.eventEmitter.emit(relatedArea.reaction);
      }
      if (relatedArea.reaction == REACTION.GITHUB_CREATE_ISSUE) {
        const pullRequestDate = getFormattedDate(new Date(data.createdAt));
        this.handleCreateIssueReaction({
          title: `Pull request [${data.repoName}] ${data.title}`,
          body: `By ${data.authorUsername}\n"${data.body}"\nOn ${pullRequestDate}\nVia Github ${data.url}`,
          reaction: relatedArea.reaction,
          reactionParams: JSON.stringify(relatedArea.reactionParams),
          ownerId: relatedArea.ownerId,
        });
      }
      if (relatedArea.reaction == REACTION.GITHUB_CREATE_ISSUE_COMMENT) {
        const pullRequestDate = getFormattedDate(new Date(data.createdAt));
        this.handleCreateIssueCommentReaction({
          body: `Pull request [${data.repoName}] ${data.title} at ${pullRequestDate}\n`,
          reaction: relatedArea.reaction,
          reactionParams: JSON.stringify(relatedArea.reactionParams),
          ownerId: relatedArea.ownerId,
        });
      }
      if (relatedArea.reaction == REACTION.NOTION_POST_NEW_BLOCK) {
        const pullRequestDate = getFormattedDate(new Date(data.createdAt));
        this.handleUpdateBlock({
          text: `Pull request [${data.repoName}] ${data.title} at ${pullRequestDate}\nVia Github ${data.url}`,
          reaction: relatedArea.reaction,
          reactionParams: JSON.stringify(relatedArea.reactionParams),
          ownerId: relatedArea.ownerId,
        });
      }
      if (relatedArea.reaction == REACTION.NOTION_POST_NEW_COMMENT) {
        const pullRequestDate = getFormattedDate(new Date(data.createdAt));
        this.handleNewComment({
          text: `Pull request [${data.repoName}] ${data.title} at ${pullRequestDate}\nVia Github ${data.url}`,
          reaction: relatedArea.reaction,
          reactionParams: JSON.stringify(relatedArea.reactionParams),
          ownerId: relatedArea.ownerId,
        });
      }
      if (relatedArea.reaction == REACTION.NOTION_UPDATE_BLOCK) {
        const pullRequestDate = getFormattedDate(new Date(data.createdAt));
        this.handleUpdateBlock({
          text: `Pull request [${data.repoName}] ${data.title} at ${pullRequestDate}\nVia Github ${data.url}`,
          reaction: relatedArea.reaction,
          reactionParams: JSON.stringify(relatedArea.reactionParams),
          ownerId: relatedArea.ownerId,
        });
      }
      if (relatedArea.reaction == REACTION.NOTION_DELETE_BLOCK) {
        this.eventEmitter.emit(relatedArea.reaction, {
          reactionParams: relatedArea.reactionParams,
          ownerId: relatedArea.ownerId,
        });
      }
      if (
        relatedArea.reaction == REACTION.NOTION_CREATE_PAGE ||
        REACTION.NOTION_CREATE_DATABASE ||
        REACTION.NOTION_UPDATE_DATABASE_TITLE
      ) {
        this.eventEmitter.emit(relatedArea.reaction, {
          reactionParams: relatedArea.reactionParams,
          ownerId: relatedArea.ownerId,
        });
      }
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('AreasService', 'HandleGithubIssue')
  async handleGithubIssue(data: IssueInfo) {
    try {
      const currentUserId: string = await this.cacheManager.get('currentUser');
      const githubLogin: string = await this.cacheManager.get('githubLogin');

      if (!currentUserId) {
        throw new RpcException('Current user is not defined');
      }
      if (!githubLogin) {
        throw new RpcException('Github login is not defined');
      }
      Logger.debug('HANDLE GITHUB PULL REQ');
      const userAreas = await this.areasService.getAreasByOwner(currentUserId);
      const relatedArea = userAreas.find((area) => {
        const actionParams = JSON.parse(area.actionParams as string);
        // Logger.debug('HERE THERE ', actionParams, typeof actionParams);
        // Logger.debug('OWNER ', actionParams.owner);
        // Logger.debug('WANTED VALUES', githubLogin, data.repoName);
        // Logger.debug('ACTION THERE', area.action);
        return (
          area.action == ACTION.GITHUB_NEW_ISSUE_REPO &&
          actionParams.owner == githubLogin &&
          actionParams.repoName == data.repoName
        );
      });

      // Logger.debug('GET RELATED AREA', JSON.stringify(relatedArea));
      if (
        relatedArea.reaction == REACTION.GMAIL_SEND_EMAIL ||
        relatedArea.reaction == REACTION.GMAIL_SEND_EMAIL_TO_YOURSELF
      ) {
        Logger.debug('GMAIL REACTION');
        const reactionParams = JSON.parse(relatedArea.reactionParams as string);
        const issueDate = getFormattedDate(new Date(data.createdAt));
        const body = `By ${data.authorUsername}\n"${data.body}"\nLabeled: ${data.issueLabels ? data.issueLabels.join(',') : ''}\nOn ${issueDate}\nVia Github ${data.url}`;
        const newReactionParams = JSON.stringify({
          body: body,
          recipient: reactionParams.recipient,
          subject: `[${data.repoName}] ${data.title}`,
        });
        this.eventEmitter.emit(relatedArea.reaction, {
          reactionParams: newReactionParams,
          ownerId: currentUserId,
        });
      }
      if (relatedArea.reaction == REACTION.REDDIT_SUBMIT_TEXT) {
        const issueDate = getFormattedDate(new Date(data.createdAt));
        this.handleSubmitTextReaction({
          title: `Issue [${data.repoName}] ${data.title}`,
          text: `By ${data.authorUsername}\n"${data.body}"\nLabeled: ${data.issueLabels ? data.issueLabels.join(',') : ''}\nOn ${issueDate}\nVia Github ${data.url}`,
          reaction: relatedArea.reaction,
          reactionParams: JSON.stringify(relatedArea.reactionParams),
          ownerId: relatedArea.ownerId,
        });
      }
      if (relatedArea.reaction == REACTION.REDDIT_SUBMIT_LINK) {
        const issueDate = getFormattedDate(new Date(data.createdAt));
        this.handleSubmitLinkReaction({
          title: `Issue [${data.repoName}] ${data.title}`,
          text: `By ${data.authorUsername}\n"${data.body}"\nLabeled: ${data.issueLabels ? data.issueLabels.join(',') : ''}\nOn ${issueDate}\nVia Github ${data.url}`,
          reaction: relatedArea.reaction,
          reactionParams: JSON.stringify(relatedArea.reactionParams),
          ownerId: relatedArea.ownerId,
          url: data.url,
        });
      }
      if (
        relatedArea.reaction == REACTION.SPOTIFY_PAUSE_PLAYBACK ||
        relatedArea.reaction == REACTION.SPOTIFY_SKIP_TO_NEXT_MUSIC ||
        relatedArea.reaction == REACTION.SPOTIFY_START_RESUME_PLAYBACK
      ) {
        this.eventEmitter.emit(relatedArea.reaction);
      }
      if (relatedArea.reaction == REACTION.GITHUB_CREATE_ISSUE) {
        const issueDate = getFormattedDate(new Date(data.createdAt));
        this.handleCreateIssueReaction({
          title: `Issue [${data.repoName}] ${data.title}`,
          body: `By ${data.authorUsername}\n"${data.body}"\nOn ${issueDate}\nVia Github ${data.url}`,
          reaction: relatedArea.reaction,
          reactionParams: JSON.stringify(relatedArea.reactionParams),
          ownerId: relatedArea.ownerId,
        });
      }
      if (relatedArea.reaction == REACTION.GITHUB_CREATE_ISSUE_COMMENT) {
        const issueDate = getFormattedDate(new Date(data.createdAt));
        this.handleCreateIssueCommentReaction({
          body: `Issue [${data.repoName}] ${data.title} at ${issueDate}\n`,
          reaction: relatedArea.reaction,
          reactionParams: JSON.stringify(relatedArea.reactionParams),
          ownerId: relatedArea.ownerId,
        });
      }
      if (relatedArea.reaction == REACTION.NOTION_POST_NEW_BLOCK) {
        const issueDate = getFormattedDate(new Date(data.createdAt));
        this.handleUpdateBlock({
          text: `Issue [${data.repoName}] ${data.title} at ${issueDate}\n${data.url}`,
          reaction: relatedArea.reaction,
          reactionParams: JSON.stringify(relatedArea.reactionParams),
          ownerId: relatedArea.ownerId,
        });
      }
      if (relatedArea.reaction == REACTION.NOTION_POST_NEW_COMMENT) {
        const issueDate = getFormattedDate(new Date(data.createdAt));
        this.handleNewComment({
          text: `Issue [${data.repoName}] ${data.title} at ${issueDate}\n${data.url}`,
          reaction: relatedArea.reaction,
          reactionParams: JSON.stringify(relatedArea.reactionParams),
          ownerId: relatedArea.ownerId,
        });
      }
      if (relatedArea.reaction == REACTION.NOTION_UPDATE_BLOCK) {
        const issueDate = getFormattedDate(new Date(data.createdAt));
        this.handleUpdateBlock({
          text: `Issue [${data.repoName}] ${data.title} at ${issueDate}\n${data.url}`,
          reaction: relatedArea.reaction,
          reactionParams: JSON.stringify(relatedArea.reactionParams),
          ownerId: relatedArea.ownerId,
        });
      }
      if (relatedArea.reaction == REACTION.NOTION_DELETE_BLOCK) {
        this.eventEmitter.emit(relatedArea.reaction, {
          reactionParams: relatedArea.reactionParams,
          ownerId: relatedArea.ownerId,
        });
      }
      if (
        relatedArea.reaction == REACTION.NOTION_CREATE_PAGE ||
        REACTION.NOTION_CREATE_DATABASE ||
        REACTION.NOTION_UPDATE_DATABASE_TITLE
      ) {
        this.eventEmitter.emit(relatedArea.reaction, {
          reactionParams: relatedArea.reactionParams,
          ownerId: relatedArea.ownerId,
        });
      }
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  async setTriggerNewCommitRepo(args: Omit<AreaParams, 'action'>) {
    try {
      const actionParams = JSON.parse(args.actionParams);
      await this.appService.setTriggerNewCommitRepo({
        repoName: actionParams.repoName,
        owner: actionParams.owner,
      });
      Logger.log(
        `Set trigger for new commits on ${actionParams.owner}'s repo ${actionParams.repoName}...`,
      );
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  async setTriggerNewPullRequestRepo(args: Omit<AreaParams, 'action'>) {
    try {
      const actionParams = JSON.parse(args.actionParams);
      await this.appService.setTriggerNewPullRequestRepo({
        repoName: actionParams.repoName,
        owner: actionParams.owner,
      });
      Logger.log(
        `Set trigger for new pull requests on ${actionParams.owner}'s repo ${actionParams.repoName}...`,
      );
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  async setTriggerNewIssueRepo(args: Omit<AreaParams, 'action'>) {
    try {
      const actionParams = JSON.parse(args.actionParams);
      await this.appService.setTriggerNewIssueRepo({
        repoName: actionParams.repoName,
        owner: actionParams.owner,
      });
      Logger.log(
        `Set trigger for new releases on ${actionParams.owner}'s repo ${actionParams.repoName}...`,
      );
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }
}

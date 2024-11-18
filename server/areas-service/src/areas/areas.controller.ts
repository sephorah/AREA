import { Controller, Inject, Logger } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { AreasService } from './areas.service';
import {
  AreaParams,
  AvailableAreas,
  Service,
  Services,
  ServicesJsonResponse,
  UserAreas,
  UserId,
} from 'src/protos/interfaces';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AppService } from 'src/app.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  ACTION,
  availableActions,
  availableReactions,
  availableServices,
} from 'src/avaliable-areas';

@Controller('')
export class AreasController {
  constructor(
    private readonly areasService: AreasService,
    private eventEmitter: EventEmitter2,
    private appService: AppService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  isWebhook(action: string): boolean {
    return action == ACTION.GITHUB_NEW_COMMIT_REPO;
  }

  handleWebhooks(areaParams: AreaParams) {
    if (areaParams.action == ACTION.GITHUB_NEW_COMMIT_REPO) {
      Logger.debug('ACTION GITHUB COMMIT');
      const actionParams = JSON.parse(areaParams.actionParams);
      this.appService.setTriggerNewCommitRepo({
        owner: actionParams.owner,
        repoName: actionParams.repoName,
      });
    }
    if (areaParams.action == ACTION.GITHUB_NEW_PULL_REQUEST_REPO) {
      Logger.debug('ACTION GITHUB PULL');
      const actionParams = JSON.parse(areaParams.actionParams);
      this.appService.setTriggerNewPullRequestRepo({
        owner: actionParams.owner,
        repoName: actionParams.repoName,
      });
    }
    if (areaParams.action == ACTION.GITHUB_NEW_ISSUE_REPO) {
      Logger.debug('ACTION GITHUB ISSUE');
      const actionParams = JSON.parse(areaParams.actionParams);
      this.appService.setTriggerNewIssueRepo({
        owner: actionParams.owner,
        repoName: actionParams.repoName,
      });
    }
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async checkAreas() {
    try {
      const currentUserId: string = await this.cacheManager.get('currentUser');
      Logger.debug('CHECK AREAS');
      Logger.debug('CURRENT USER', currentUserId);
      if (currentUserId) {
        const allAreas = await this.areasService.getAreasByOwner(currentUserId);
        for (const area of allAreas) {
          Logger.debug('EACH AREA', JSON.stringify(area));
          if (!this.isWebhook(area.action)) {
            this.eventEmitter.emit(area.action, {
              actionParams: area.actionParams,
              reaction: area.reaction,
              reactionParams: area.reactionParams,
              ownerId: area.ownerId,
            });
          }
        }
      }
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleAccessTokens() {
    try {
      this.appService.refreshTokenGoogle({});
      this.appService.refreshTokenSpotify({});
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('AreasService', 'CreateArea')
  async createArea(data: AreaParams) {
    try {
      const actionParams = JSON.parse(data.actionParams);
      const reactionParams = JSON.parse(data.reactionParams);
      Logger.debug('ACTION PARAMS', actionParams);
      Logger.debug('REACTION PARAMS', reactionParams);
      this.areasService.createArea({
        actionParams: actionParams,
        reactionParams: reactionParams,
        ...data,
      });
      this.handleWebhooks(data);
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('AreasService', 'GetServices')
  async getServices(): Promise<Services> {
    try {
      return { services: availableServices };
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('AreasService', 'GetAvailableActionsPerService')
  async getAvailableActionsPerService(data: Service): Promise<AvailableAreas> {
    try {
      return {
        areas: availableActions.filter((action) => action.service == data.name),
      };
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('AreasService', 'GetAvailableReactionsPerService')
  async getAvailableReactionsPerService(
    data: Service,
  ): Promise<AvailableAreas> {
    try {
      Logger.debug(
        availableReactions.filter((reaction) => reaction.service == data.name),
      );
      return {
        areas: availableReactions.filter(
          (reaction) => reaction.service == data.name,
        ),
      };
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('AreasService', 'GetAreasByUser')
  async getAreasByUser(data: UserId): Promise<UserAreas> {
    try {
      return {
        areas: (await this.areasService.getAreasByOwner(data.userId)).map(
          (area) => {
            const descriptionEnAction = availableActions.find(
              (action) => action.name == area.action,
            )?.enDescription;
            const descriptionFrAction = availableActions.find(
              (action) => action.name == area.action,
            )?.frDescription;
            const descriptionEnReaction = availableReactions.find(
              (reaction) => reaction.name == area.reaction,
            )?.enDescription;
            const descriptionFrReaction = availableReactions.find(
              (reaction) => reaction.name == area.reaction,
            )?.frDescription;

            return {
              id: area.id,
              ownerId: area.ownerId,
              action: area.action,
              reaction: area.reaction,
              actionParams: area.actionParams.toString(),
              reactionParams: area.reactionParams.toString(),
              descriptionEnAction: descriptionEnAction
                ? descriptionEnAction
                : '',
              descriptionFrAction: descriptionFrAction
                ? descriptionFrAction
                : '',
              descriptionEnReaction: descriptionEnReaction
                ? descriptionEnReaction
                : '',
              descriptionFrReaction: descriptionFrReaction
                ? descriptionFrReaction
                : '',
            };
          },
        ),
      };
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('AreasService', 'DeleteAllAreas')
  async deleteAllAreas() {
    try {
      const areas = (await this.areasService.getAreas()).map((area) => {
        return {
          id: area.id,
        };
      });

      areas.map((area) => {
        this.areasService.deleteArea(area.id);
      });
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @GrpcMethod('AreasService', 'GetServicesInfo')
  async getServicesInfo(): Promise<ServicesJsonResponse> {
    try {
      return {
        services: availableServices.map((service) => {
          return {
            name: service.name,
            actions: availableActions
              .filter((action) => action.service == service.name)
              .map((action) => {
                return {
                  name: action.name,
                  description: action.enDescription,
                };
              }),
            reactions: availableReactions
              .filter((reaction) => reaction.service == service.name)
              .map((reaction) => {
                return {
                  name: reaction.name,
                  description: reaction.enDescription,
                };
              }),
          };
        }),
      };
    } catch (error) {
      throw new RpcException(error);
    }
  }
}

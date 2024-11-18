import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { NotionTriggersService } from './triggers.service';
import {
  NotionBlockId,
  NotionChildrenBlock,
  NotionCommentsInfo,
  NotionDatabaseId,
  NotionEmailUser,
  NotionLastEditedBlock,
  NotionLastEditedDatabase,
  NotionLastEditedPage,
  NotionNameUser,
  NotionPageId,
  NotionTitleBlock
} from 'src/protos/interfaces';

@Controller()
export class NotionTriggersController {
  constructor(private readonly triggersService: NotionTriggersService) { }

  @GrpcMethod('NotionService', 'GetNameUser')
  async getNameUser(): Promise<NotionNameUser> {
    const getName = await this.triggersService.getNameUser();
    return { name: getName };
  }

  @GrpcMethod('NotionService', 'GetEmailUser')
  async getEmailUser(): Promise<NotionEmailUser> {
    const getEmail = await this.triggersService.getEmailUser();
    return { email: getEmail };
  }

  @GrpcMethod('NotionService', 'GetOwnerName')
  async getOwnerName(): Promise<NotionNameUser> {
    const getName = await this.triggersService.getOwnerName();
    return { name: getName };
  }

  @GrpcMethod('NotionService', 'GetLastEditedBlock')
  async getLastEditedBlock(data: NotionBlockId): Promise<NotionLastEditedBlock> {
    const getDate = await this.triggersService.getLastEditedBlock(data);
    return getDate;
  }

  @GrpcMethod('NotionService', 'GetChildrenBlock')
  async getChildrenBlock(data: NotionBlockId): Promise<NotionChildrenBlock> {
    const getChildren = await this.triggersService.getChildrenBlock(data);
    return getChildren;
  }

  @GrpcMethod('NotionService', 'GetLastEditedPage')
  async getLastEditedPage(data: NotionPageId): Promise<NotionLastEditedPage> {
    const getDate = await this.triggersService.getLastEditedPage(data);
    return getDate;
  }

  @GrpcMethod('NotionService', 'GetLastEditedDatabase')
  async getLastEditedDatabase(data: NotionDatabaseId): Promise<NotionLastEditedDatabase> {
    const getDate = await this.triggersService.getLastEditedDatabase(data);
    return getDate;
  }

  @GrpcMethod('NotionService', 'GetCommentsOnBlock')
  async getCommentsOnBlock(data: NotionBlockId): Promise<NotionCommentsInfo> {
    const comments = await this.triggersService.getCommentsOnBlock(data);
    return comments;
  }
}

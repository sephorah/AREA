import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { NotionReactionsService } from './reactions.service';
import { NotionBlockId,
  NotionCreatePage,
  NotionNewComment,
  NotionTitleBlock,
  NotionUpdateBlock,
  NotionUpdateDatabase
} from 'src/protos/interfaces';

@Controller()
export class NotionReactionsController {
  constructor(private readonly reactionService: NotionReactionsService) { }

  @GrpcMethod('NotionService', 'PostNewBlock')
  async postNewBlock(data: NotionTitleBlock) {
    await this.reactionService.postNewBlock({ text: data.text, pageId: data.pageId })
  }

  @GrpcMethod('NotionService', 'PostNewComment')
  async postNewComment(data: NotionNewComment) {
    await this.reactionService.postNewComment(data)
  }

  @GrpcMethod('NotionService', 'UpdateBlock')
  async updateBlock(data: NotionUpdateBlock) {
    await this.reactionService.updateBlock(data)
  }

  @GrpcMethod('NotionService', 'DeleteBlock')
  async deleteBlock(data: NotionBlockId) {
    await this.reactionService.deleteBlock(data)
  }

  @GrpcMethod('NotionService', 'CreatePage')
  async createPage(data: NotionCreatePage) {
    await this.reactionService.createPage(data)
  }

  @GrpcMethod('NotionService', 'CreateDatabase')
  async createDatabase(data: NotionCreatePage) {
    await this.reactionService.createDatabase(data)
  }

  @GrpcMethod('NotionService', 'UpdateDatabaseTitle')
  async updateDatabaseTitle(data: NotionUpdateDatabase) {
    await this.reactionService.updateDatabaseTitle(data)
  }
}

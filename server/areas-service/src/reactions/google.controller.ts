import { Controller, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { AreasService } from '../areas/areas.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { AppService } from 'src/app.service';
import { REACTION } from 'src/avaliable-areas';
import { ReactionParams } from 'src/protos/interfaces';

@Controller('')
export class GoogleReactionsController {
  constructor(
    private eventEmitter: EventEmitter2,
    private readonly appService: AppService,
    private readonly areasService: AreasService,
  ) {}

  @OnEvent(REACTION.GMAIL_SEND_EMAIL)
  async sendEmail(reaction: ReactionParams) {
    try {
      Logger.debug("CA RENTRE LA");
      const params = JSON.parse(reaction.reactionParams);
      this.appService.sendEmail({
        recipient: params.recipient,
        subject: params.subject,
        body: params.body,
      });
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  } 

  @OnEvent(REACTION.GMAIL_SEND_EMAIL_TO_YOURSELF)
  async sendEmailToYourself(reaction: ReactionParams) {
    try {
      const params = JSON.parse(reaction.reactionParams);
      this.appService.sendEmailToYourself({
        subject: params.subject,
        body: params.body,
      });
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }
}

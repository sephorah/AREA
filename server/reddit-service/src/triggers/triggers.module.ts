import { Module } from '@nestjs/common';
import { RedditTriggersService } from './triggers.service';
import { RedditTriggersController } from './triggers.controller';

@Module({
  imports: [],
  controllers: [RedditTriggersController],
  providers: [RedditTriggersService],
})
export class RedditTriggersModule {}

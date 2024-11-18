import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { NotionReactionsController } from './reactions.controller';
import { NotionReactionsService } from './reactions.service';

@Module({
  imports: [],
  controllers: [NotionReactionsController],
  providers: [NotionReactionsService],
})

export class NotionReactionsModule {}

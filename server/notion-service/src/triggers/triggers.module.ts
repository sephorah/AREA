import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { NotionTriggersController } from './triggers.controller';
import { NotionTriggersService } from './triggers.service';

@Module({
  imports: [],
  controllers: [NotionTriggersController],
  providers: [NotionTriggersService],
})

export class NotionTriggersModule {}

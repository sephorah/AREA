import { Module } from '@nestjs/common';
import { DiscordTriggersService } from './triggers.service';
import { DiscordTriggersController } from './triggers.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [],
  controllers: [DiscordTriggersController],
  providers: [DiscordTriggersService],
})

export class DiscordTriggersModule {}

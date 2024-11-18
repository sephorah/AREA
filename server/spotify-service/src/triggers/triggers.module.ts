import { Module } from '@nestjs/common';
import { SpotifyTriggersService } from './triggers.service';
import { SpotifyTriggersController } from './triggers.controller';

@Module({
  imports: [],
  controllers: [SpotifyTriggersController],
  providers: [SpotifyTriggersService],
})
export class SpotifyTriggersModule {}

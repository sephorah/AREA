import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { IslamicPrayerTriggersController } from './triggers.controller';
import { IslamicPrayerTriggersService } from './triggers.service';

@Module({
  imports: [],
  controllers: [IslamicPrayerTriggersController],
  providers: [IslamicPrayerTriggersService],
})

export class IslamicPrayerTriggersModule {}

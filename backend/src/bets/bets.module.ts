import { Module } from '@nestjs/common';
import { BetsService } from './bets.service';
import { BetsController } from './bets.controller';

@Module({
  controllers: [BetsController],
  providers: [BetsService],
})
export class BetsModule {}

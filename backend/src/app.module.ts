import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MarketsModule } from './markets/markets.module';
import { BetsModule } from './bets/bets.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, MarketsModule, BetsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

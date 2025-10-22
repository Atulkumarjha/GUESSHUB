import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    UsersModule,
    // Configure MongoDB connection. Uses MONGO_URI env var if set; falls back to local MongoDB.
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/guesshub',
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

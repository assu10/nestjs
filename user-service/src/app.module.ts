import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';

@Module({
  imports: [],
  controllers: [UsersController],
  //providers: [AppService],
})
export class AppModule {}

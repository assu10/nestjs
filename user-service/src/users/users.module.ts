import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { EmailModule } from '../email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [EmailModule, TypeOrmModule.forFeature([UserEntity]), AuthModule], // UsersModule 에 forFeature() 로 유저 모듈 내에서 사용할 저장소 등록
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}

import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserInfo } from './UserInfo';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  // UsersService 를 컨트롤러에 주입
  constructor(private readonly usersService: UsersService) {}
  // 회원 가입
  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    const { name, email, password } = dto;
    console.log('createUser dto: ', dto);
    await this.usersService.createUser(name, email, password);
  }

  // 이메일 인증
  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;
    console.log('verifyEmail dto: ', dto);
    return await this.usersService.verifyEmail(signupVerifyToken);
  }

  // 로그인
  @Post('login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    const { email, password } = dto;
    console.log('login dto: ', dto);
    return await this.usersService.login(email, password);
  }

  // 유저 정보 조회
  @Get(':id')
  async getUserInfo(@Param('id') userId: string): Promise<UserInfo> {
    console.log('getUserInfo userId: ', userId);
    return await this.usersService.getUserInfo(userId);
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Headers,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserInfo } from './UserInfo';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';

@Controller('users')
export class UsersController {
  // UsersService 를 컨트롤러에 주입
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}
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
  async getUserInfo(
    @Headers() headers: any,
    @Param('id') userId: string,
  ): Promise<UserInfo> {
    // jwt 파싱
    const jwtString = headers.authorization.split('Bearer ')[1];
    this.authService.verify(jwtString);
    return await this.usersService.getUserInfo(userId);
  }
}

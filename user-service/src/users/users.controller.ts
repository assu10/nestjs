import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Headers,
  UseGuards,
  Inject,
  LoggerService,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserInfo } from './UserInfo';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from 'src/auth.guard';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './command/create-user.command';
import { VerifyEmailCommand } from './command/verify-email.command';
import { LoginCommand } from './command/login.command';
import { GetUserInfoQuery } from './query/get-user-info.query';

@Controller('users')
export class UsersController {
  // UsersService 를 컨트롤러에 주입
  constructor(
    private readonly authService: AuthService,

    // @nestjs/cqrs 패키지에서 제공하는 CommandBus 주입
    private commandBus: CommandBus,

    private queryBus: QueryBus,

    // 내장 로거 대체
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  /*  // 회원 가입 - UsersService 사용
  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    const { name, email, password } = dto;
    console.log('createUser dto: ', dto);
    //this.printWinstonLog(dto);
    //this.printLoggerServiceLog(dto);
    await this.usersService.createUser(name, email, password);
  }*/

  // 회원 가입 - Command 사용
  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    const { name, email, password } = dto;

    const command = new CreateUserCommand(name, email, password);

    // 직접 만든 CreateUserCommand 전송
    return this.commandBus.execute(command);
  }

  // 내장 로거 대체
  /*  private printLoggerServiceLog(dto) {
    try {
      throw new InternalServerErrorException('test');
    } catch (e) {
      this.logger.error('error::', JSON.stringify(dto), e.stack);
    }
    // console.log(this.logger.name);

    this.logger.warn('warn: ', JSON.stringify(dto));
    this.logger.log('log: ', JSON.stringify(dto));
    this.logger.verbose('verbose: ', JSON.stringify(dto));
    this.logger.debug('debug: ', JSON.stringify(dto));
  }*/

  /*  // 이메일 인증 - UsersService 사용
  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;
    console.log('verifyEmail dto: ', dto);
    return await this.usersService.verifyEmail(signupVerifyToken);
  }*/

  // 이메일 인증 - Command 사용
  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;

    const command = new VerifyEmailCommand(signupVerifyToken);

    return this.commandBus.execute(command);
  }

  // // 로그인
  // @Post('login')
  // async login(@Body() dto: UserLoginDto): Promise<string> {
  //   const { email, password } = dto;
  //   console.log('login dto: ', dto);
  //   return await this.usersService.login(email, password);
  // }

  // 로그인
  @Post('login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    const { email, password } = dto;
    const command = new LoginCommand(email, password);
    return this.commandBus.execute(command);
  }

  // // 유저 정보 조회 - UserService 사용
  // @UseGuards(AuthGuard)
  // @Get(':id')
  // async getUserInfo(
  //   @Headers() headers: any,
  //   @Param('id') userId: string,
  // ): Promise<UserInfo> {
  //   const getUserInfoQuery = new GetUserInfoQuery(userId);
  //   return await this.usersService.getUserInfo(userId);
  // }

  // 유저 정보 조회 - Query 사용
  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserInfo(
    @Headers() headers: any,
    @Param('id') userId: string,
  ): Promise<UserInfo> {
    const getUserInfoQuery = new GetUserInfoQuery(userId);

    return this.queryBus.execute(getUserInfoQuery);
  }
}

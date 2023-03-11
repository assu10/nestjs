import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  BadRequestException,
  Header,
  Redirect,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @HttpCode(202)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Header('CustomHeader', 'Test~')
  @Redirect('https://www.naver.com', 301)
  @Get(':id')
  findOne(@Param('id') id: string) {
    if (+id < 1) {
      throw new BadRequestException('id error');
    }
    return this.usersService.findOne(+id);
  }

  @Get('/redirect/test')
  @Redirect('', 302)
  redirectTest(@Query('ver') version) {
    if (version) {
      return { url: `https://docs.nestjs.com/${version}` };
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  // @Delete(':userId/memo/:memoId')
  // deleteUserMemo(@Param() params: { [key: string]: string }) {
  //   return `userId: ${params.userId}, memoId: ${params.memoId}`;
  // }

  @Delete(':userId/memo/:memoId')
  deleteUserMemo(
    @Param('userId') userId: string,
    @Param('memoId') memoId: string,
  ) {
    return `userId: ${userId}, memoId: ${memoId}`;
  }
}

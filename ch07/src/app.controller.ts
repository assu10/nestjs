import {
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ValidationPipe } from './validation.pipe';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @Get(':id')
  // findOne(@Param('id', ParseIntPipe) id: number) {
  //   return id + 2;
  // }

  // @Get(':id')
  // findOne(
  //   @Param(
  //     'id',
  //     new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
  //   )
  //   id: number,
  // ) {
  //   return id + 2;
  // }
  //
  // @Get('user/all')
  // findAll(
  //   @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  //   @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  // ) {
  //   console.log(offset, limit);
  //   return offset;
  // }

  @Get(':id')
  findOne(@Param('id', ValidationPipe) id: number) {
    return id;
  }
}

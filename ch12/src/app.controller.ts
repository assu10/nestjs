import {
  BadRequestException,
  Controller,
  Get,
  Param,
  UseFilters,
} from '@nestjs/common';
import { AppService } from './app.service';
import { HttpExceptionFilter } from './http-exception.filter';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  //@UseFilters(HttpExceptionFilter)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('error')
  error(foo: any): string {
    return foo.bar();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log(id); // id 가 pp 인 경우 pp
    console.log(+id); // id 가 pp 인 경우 NaN
    if (+id < 1) {
      //throw new BadRequestException('id 는 0 보다 커야함');
      throw new BadRequestException('id 는 0 보다 커야함', 'id exception');
    }
    return null;
  }
}

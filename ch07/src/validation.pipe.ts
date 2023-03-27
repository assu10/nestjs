import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform {
  // transform(value: any, metadata: ArgumentMetadata): any {
  //   console.log('value: ', value);
  //   console.log('metadata: ', metadata);
  //   return undefined;
  // }
  async transform(value: any, { metatype }: ArgumentMetadata) {
    // metatype 이 Pipe 가 지원하는 타입인지 검사
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    // 순수 자바스크립트 객체를 클래스 객체로 변경
    // (네트워크를 통해 들어온 데이터는 역직렬화 과정에서 body 의 객체가 아무런 타입 정보도 없기 때문에 타입을 지정하는 변환 과정)
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed~');
    }
    return value; // 유효성 검사 통과했다면 원래의 값 그대로 전달
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private toValidate(metatype: Function): boolean {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const types: Function[] = [String, Boolean, Number, Array, Object];
    console.log(!types.includes(metatype));
    return !types.includes(metatype);
  }
}

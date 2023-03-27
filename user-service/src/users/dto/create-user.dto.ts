import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';
import { NotIn } from '../../utils/decorators/not-in';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  @Transform((params) => params.value.trim())
  @NotIn('password', { message: 'password 는 name 과 같은 문자 포함 불가' })
  readonly name: string;

  @IsString()
  @IsEmail()
  @MaxLength(60)
  readonly email: string;

  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  // @Transform(({ value, obj }) => {
  //   if (obj.password.includes(obj.name.trim())) {
  //     throw new BadRequestException('password 에 name 과 같은 문자열 포함');
  //   }
  //   return value.trim();
  // })
  readonly password: string;
}

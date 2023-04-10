import * as jwt from 'jsonwebtoken';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import authConfig from '../config/authConfig';

interface User {
  id: string;
  name: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    // 주입받을 때 @Inject 데커레이터의 토큰을 앞에서 만든 ConfigFactory 의 KEY 인 `auth` 문자열로 넣어준다.
    @Inject(authConfig.KEY) private config: ConfigType<typeof authConfig>,
  ) {}

  // 로그인 처리
  login(user: User) {
    // Private claim
    const payload = { ...user };

    // Registered claim
    return jwt.sign(payload, this.config.jwtSecret, {
      expiresIn: '1d',
      audience: 'test.com',
      issuer: 'test.com',
    });
  }

  // jwt 검증
  verify(jwtString: string) {
    try {
      // 외부에 노출되지 않는 secret 을 사용하기 때문에 이 토큰이 유효한지 검증 가능
      const payload = jwt.verify(jwtString, this.config.jwtSecret) as (
        | jwt.JwtPayload
        | string
      ) &
        User;

      const { id, email } = payload;

      return {
        userId: id,
        email,
      };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}

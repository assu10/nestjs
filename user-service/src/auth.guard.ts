import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  // 얻은 정보(request) 를 내부 규칙으로 평가 진행
  private validateRequest(request: any) {
    const jwtString = request.headers.authorization.split('Bearer ')[1];
    this.authService.verify(jwtString);
    // false 로 리턴 시 403 Forbidden 에러 발생함
    // 다른 에러 응답을 원하면 직접 다른 예외 생성해서 던지면 됨
    return true;
  }
}

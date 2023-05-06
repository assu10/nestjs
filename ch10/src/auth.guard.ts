import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  // 얻은 정보(request) 를 내부 규칙으로 평가 진행
  private validateRequest(request: any) {
    // JWT 를 검증해서 얻은 정보 넣음. 편의상 하드코딩함
    request.user = {
      name: 'assu',
      email: 'test@test.com',
    };
    return true;
  }
}

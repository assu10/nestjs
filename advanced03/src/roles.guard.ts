import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    // 편의상 JWT 를 검증해서 얻은 userid 라고 가정 (request.user 객체에서 얻음)
    const userId = 'abcde';

    // 편의상 userId 이용해서 DB 에서 역할을 가져왔다고 가정
    const userRole = this.getUserRole(userId);

    // 가드에 주입받은 Reflector 를 이용하여 메타데이터 리스트 얻음
    const roles = this.reflector.getAllAndMerge<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log('----RolesGuard: ', roles);

    // DB 에서 얻은 값이 메타데이터에 포함되어 있는지 확인
    return roles?.includes(userRole) ?? true;
  }
  private getUserRole(userId: string): string {
    //return 'admin';
    return 'user';
  }
}

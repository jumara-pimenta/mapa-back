import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RequestContext } from 'nestjs-request-context';
import { ROLES_KEY } from '../../decorators/roles.decorator';
import { IS_PUBLIC_KEY } from '../../decorators/public.decorator';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic || process.env.NODE_ENV === 'development') return true;

    return true;
    const extractJwt =
      RequestContext.currentContext.req.header('authorization');
    await this.authService.authenticate(extractJwt);

    const user = await this.authService.decodeJWT(extractJwt);

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    if (!requiredRoles.some((role) => user.permissions?.includes(role))) {
      throw new HttpException(
        'Usuário não autorizado para acessar este recurso!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return requiredRoles.some((role) => user.permissions?.includes(role));
  }
}

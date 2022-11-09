import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RequestContext } from "nestjs-request-context";
import { IS_PUBLIC_KEY } from "../../decorators/public.decorator";
import { AuthService } from "../../services/auth.service";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService
  ) { }

  async canActivate(context: ExecutionContext) {
    try {
      const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass()
      ])

      if (isPublic || process.env.MOCK_SERVER === "true") return true

      const extractJwt = RequestContext.currentContext.req.header("authorization");

      await this.authService.authenticate(extractJwt);

      return true

    } catch (e) {
      throw new HttpException('unauthorized', HttpStatus.UNAUTHORIZED)
    }
  }
}

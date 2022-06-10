import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { GUEST_KEY } from '~/auth/decorators/auth.decorator'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    // get GUEST_KEY metadata from handler function or controller class
    // if metadata is present in handler it is returned before checking the class
    const guest = this.reflector.getAllAndOverride<boolean>(GUEST_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (guest) return true

    return super.canActivate(context)
  }
}

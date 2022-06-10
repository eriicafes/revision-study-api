import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AuthService } from '~/auth/auth.service'
import { JwtPayload } from '~/auth/interfaces/jwt.interface'
import { AppConfigService } from '~/core/services/config.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authservice: AuthService,
    appConfigService: AppConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: appConfigService.get('APP_SECRET'),
    })
  }

  // validate jwt payload and add returned user to request object (ie. req.user)
  async validate(payload: JwtPayload) {
    const user = await this.authservice.validate(payload)

    return user
  }
}

import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthController } from '~/auth/auth.controller'
import { AuthService } from '~/auth/auth.service'
import { JwtStrategy } from '~/auth/strategies/jwt.strategy'
import { AppConfigService } from '~/core/services/config.service'
import { UsersModule } from '~/users/users.module'

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (appConfigService: AppConfigService) => ({
        secret: appConfigService.get('APP_SECRET'),
        signOptions: {
          expiresIn: appConfigService.get('TOKEN_LIFETIME_IN_DAYS') + 'd', // eg. 30d for 30 days
        },
      }),
      inject: [AppConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}

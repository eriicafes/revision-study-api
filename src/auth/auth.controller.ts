import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from '~/auth/auth.service';
import { Auth, Guest } from '~/auth/decorators/auth.decorator';
import { User } from '~/auth/decorators/user.decorator';
import { LoginUserDto } from '~/auth/dto/login-user.dto';
import { RegisterUserDto } from '~/auth/dto/register-user.dto';
import { UserEntity } from '~/users/entities/user.entity';

@Guest()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  public async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.authenticate(
      loginUserDto.email,
      loginUserDto.password,
    );
  }

  @Auth()
  @Get('profile')
  public async profile(@User() user: UserEntity) {
    return user;
  }

  @Post('register')
  public async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }
}

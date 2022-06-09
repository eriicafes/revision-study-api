import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserEntity } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { Auth, Guest } from './decorators/auth.decorator';
import { User } from './decorators/user.decorator';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Guest()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("login")
  public async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.authenticate(loginUserDto.email, loginUserDto.password)
  }

  @Auth()
  @Get("profile")
  public async profile(@User() user: UserEntity) {
    return user
  }

  @Post("register")
  public async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto)
  }
}

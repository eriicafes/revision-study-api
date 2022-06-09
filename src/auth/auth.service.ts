import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersRepository } from 'src/users/users.repository';
import { RegisterUserDto } from './dto/register-user.dto';
import { TokenEntity } from './entities/token.entity';
import { JwtPayload } from './interfaces/jwt.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly jwtService: JwtService,
    ) { }

    // authenticates a user given an email and password
    // authentication fails if user does not exist or if password does not match
    // the same error is thrown in both cases to prevent attackers from retrying passwords guess
    public async authenticate(email: string, password: string): Promise<TokenEntity> {
        const user = await this.usersRepository.findByEmail(email)

        if (!user) throw new UnauthorizedException("Invalid email address or password")

        const isValidPassword = await bcrypt.compare(password, user.password)

        if (!isValidPassword) throw new UnauthorizedException("Invalid email address or password")

        const jwtPayload: JwtPayload = {
            sub: user.id,
            email: user.email,
        }

        const accessToken = this.jwtService.sign(jwtPayload)

        return new TokenEntity({ accessToken })
    }

    // validates jwt payload and return a user entity
    public async validate(payload: JwtPayload): Promise<UserEntity> {
        const user = await this.usersRepository.findById(payload.sub)

        if (!user) throw new UnauthorizedException("Invalid token")

        return new UserEntity(user)
    }

    // registers a new user
    public async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
        const hashedPassword = await bcrypt.hash(registerUserDto.password, 10)

        const user = await this.usersRepository.create({
            ...registerUserDto,
            password: hashedPassword
        })

        return new UserEntity(user)
    }
}

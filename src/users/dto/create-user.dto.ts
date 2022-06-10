import { Prisma } from '@prisma/client'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class CreateUserDto implements Prisma.UserCreateInput {
  @IsNotEmpty()
  firstName!: string

  @IsEmail()
  email!: string

  @IsNotEmpty()
  lastName!: string

  @IsNotEmpty()
  password!: string
}

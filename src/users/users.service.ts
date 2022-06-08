import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/services/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = await this.prismaService.user.create({
      data: createUserDto
    })

    return new UserEntity(user)
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.prismaService.user.findMany()

    return users.map(user => new UserEntity(user))
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.prismaService.user.findUnique({
      where: { id }
    })

    return new UserEntity(user)
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.prismaService.user.update({
      where: { id },
      data: updateUserDto
    })

    return new UserEntity(user)
  }

  async remove(id: string): Promise<UserEntity> {
    const user = await this.prismaService.user.delete({
      where: { id }
    })

    return new UserEntity(user)
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) { }

  public async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = await this.usersRepository.create(createUserDto)

    return new UserEntity(user)
  }

  public async findAll(): Promise<UserEntity[]> {
    const users = await this.usersRepository.findAll()

    return users.map(user => new UserEntity(user))
  }

  public async findById(id: string): Promise<UserEntity> {
    const user = await this.usersRepository.findById(id)

    if (!user) throw new NotFoundException()

    return new UserEntity(user)
  }

  public async findByEmail(email: string): Promise<UserEntity> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) throw new NotFoundException()

    return new UserEntity(user)
  }

  public async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.usersRepository.update(id, updateUserDto)

    return new UserEntity(user)
  }

  public async remove(id: string): Promise<UserEntity> {
    const user = await this.usersRepository.remove(id)

    return new UserEntity(user)
  }
}

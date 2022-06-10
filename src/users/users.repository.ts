import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '~/core/services/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(createUserData: Prisma.UserCreateInput) {
    return this.prismaService.user.create({
      data: createUserData,
    });
  }

  public async findAll() {
    return this.prismaService.user.findMany();
  }

  public async findById(id: string) {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }

  public async findByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }

  public async update(id: string, updateUserData: Prisma.UserUpdateInput) {
    return this.prismaService.user.update({
      where: { id },
      data: updateUserData,
    });
  }

  public async remove(id: string) {
    return this.prismaService.user.delete({
      where: { id },
    });
  }
}

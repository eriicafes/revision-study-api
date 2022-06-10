import { Module } from '@nestjs/common';
import { UsersController } from '~/users/users.controller';
import { UsersRepository } from '~/users/users.repository';
import { UsersService } from '~/users/users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule { }

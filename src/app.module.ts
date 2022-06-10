import { Module } from '@nestjs/common';
import { AppController } from '~/app.controller';
import { AppService } from '~/app.service';
import { AuthModule } from '~/auth/auth.module';
import { CoreModule } from '~/core/core.module';
import { UsersModule } from '~/users/users.module';

@Module({
  imports: [CoreModule, AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

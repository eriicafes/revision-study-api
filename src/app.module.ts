import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { CollectionsModule } from './collections/collections.module'
import { CoreModule } from './core/core.module'
import { QuestionsModule } from './questions/questions.module'
import { TagsModule } from './tags/tags.module'
import { TestsModule } from './tests/tests.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [
    CoreModule,
    AuthModule,
    UsersModule,
    QuestionsModule,
    CollectionsModule,
    TagsModule,
    TestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

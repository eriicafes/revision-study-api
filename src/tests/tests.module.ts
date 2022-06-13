import { Module } from '@nestjs/common'
import { CollectionsModule } from '~/collections/collections.module'
import { TagsModule } from '~/tags/tags.module'
import { TestsController } from './tests.controller'
import { TestsRepository } from './tests.repository'
import { TestsService } from './tests.service'

@Module({
  controllers: [TestsController],
  providers: [TestsService, TestsRepository],
  exports: [TestsRepository],
  imports: [CollectionsModule, TagsModule],
})
export class TestsModule {}

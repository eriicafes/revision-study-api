import { Module } from '@nestjs/common'
import { TagsController } from './tags.controller'
import { TagsRepository } from './tags.repository'
import { TagsService } from './tags.service'

@Module({
  controllers: [TagsController],
  providers: [TagsService, TagsRepository],
  exports: [TagsRepository],
})
export class TagsModule {}

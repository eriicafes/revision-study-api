import { Module } from '@nestjs/common'
import { CollectionsController } from './collections.controller'
import { CollectionsRepository } from './collections.repository'
import { CollectionsService } from './collections.service'

@Module({
  controllers: [CollectionsController],
  providers: [CollectionsService, CollectionsRepository],
  exports: [CollectionsRepository],
})
export class CollectionsModule {}

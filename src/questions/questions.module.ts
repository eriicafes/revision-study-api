import { Module } from '@nestjs/common'
import { QuestionsController } from './questions.controller'
import { QuestionsRepository } from './questions.repository'
import { QuestionsService } from './questions.service'

@Module({
  controllers: [QuestionsController],
  providers: [QuestionsService, QuestionsRepository],
  exports: [QuestionsRepository],
})
export class QuestionsModule {}

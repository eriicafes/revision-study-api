import { Question, Test } from '@prisma/client'
import { Type } from 'class-transformer'
import { QuestionEntity } from '~/questions/entities/question.entity'

export type TestWithQuestions = Test & { questions: Question[] }

export class TestEntity implements TestWithQuestions {
  id!: string

  userId!: string

  title!: string

  description!: string

  @Type(() => QuestionEntity)
  questions!: QuestionEntity[]

  createdAt!: Date
  updatedAt!: Date

  constructor(test: TestWithQuestions) {
    Object.assign(this, test)
    this.questions = test.questions.map(
      (question) => new QuestionEntity(question),
    )
  }
}

import { Question, Test } from '@prisma/client'
import { Type } from 'class-transformer'
import { QuestionEntity } from '~/questions/entities/question.entity'

export type TestWithQuestionsCount = Test & { questionsCount: number }
export type TestWithQuestions = Test & { questions: Question[] }

export class TestLeanEntity implements Test {
  id!: string

  userId!: string

  title!: string

  description!: string

  createdAt!: Date
  updatedAt!: Date

  constructor(test: Test) {
    Object.assign(this, test)
  }
}

export class TestWithCountEntity implements TestWithQuestionsCount {
  id!: string

  userId!: string

  title!: string

  description!: string

  questionsCount!: number

  createdAt!: Date
  updatedAt!: Date

  constructor(test: TestWithQuestionsCount) {
    Object.assign(this, test)
  }
}

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

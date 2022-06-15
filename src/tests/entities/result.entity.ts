import { Result } from '@prisma/client'
import { Type } from 'class-transformer'
import {
  AnswerEntity,
  AnswerWithQuestion,
} from '~/questions/entities/answer.entity'

export type ResultWithAnswers = Result & {
  answers: AnswerWithQuestion[]
}

export class ResultEntity implements ResultWithAnswers {
  id!: string

  testId!: string

  score!: number

  @Type(() => AnswerEntity)
  answers!: AnswerEntity[]

  createdAt!: Date

  constructor(result: ResultWithAnswers) {
    Object.assign(this, result)
    this.answers = result.answers.map((answer) => new AnswerEntity(answer))
  }
}

import { Answer, Question } from '@prisma/client'
import { Exclude, Type } from 'class-transformer'
import { QuestionEntity } from './question.entity'

export type AnswerWithQuestion = Answer & { question: Question }

export class AnswerLeanEntity implements Answer {
  questionId!: string

  resultId!: string

  answer!: string

  isCorrect!: boolean

  createdAt!: Date

  constructor(answer: Answer) {
    Object.assign(this, answer)
  }
}

export class AnswerEntity implements AnswerWithQuestion {
  @Exclude()
  questionId!: string

  @Type(() => QuestionEntity)
  question!: QuestionEntity

  resultId!: string

  answer!: string

  isCorrect!: boolean

  createdAt!: Date

  constructor(answer: AnswerWithQuestion) {
    Object.assign(this, answer)
    this.question = new QuestionEntity(answer.question)
  }
}

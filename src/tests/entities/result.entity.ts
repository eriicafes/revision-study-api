import { Question, Result, ResultQuestion, Test } from '@prisma/client'
import { Exclude, Type } from 'class-transformer'
import { QuestionEntity } from '~/questions/entities/question.entity'
import { TestLeanEntity } from './test.entity'

export type ResultQuestionsWithQuestion = ResultQuestion & {
  question: Question
}
export type ResultWithQuestionAndTest = Result & {
  questions: ResultQuestionsWithQuestion[]
  test: Test
}

export class ResultQuestionEntity implements ResultQuestionsWithQuestion {
  @Exclude()
  questionId!: string

  @Exclude()
  resultId!: string

  answer!: string

  isCorrect!: boolean

  @Type(() => QuestionEntity)
  question!: QuestionEntity

  createdAt!: Date

  constructor(resultQuestion: ResultQuestionsWithQuestion) {
    Object.assign(this, resultQuestion)
    this.question = new QuestionEntity(resultQuestion.question)
  }
}

export class ResultEntity implements ResultWithQuestionAndTest {
  id!: string

  testId!: string

  score!: number

  @Type(() => ResultQuestionEntity)
  questions!: ResultQuestionEntity[]

  @Type(() => TestLeanEntity)
  test!: TestLeanEntity

  createdAt!: Date

  constructor(result: ResultWithQuestionAndTest) {
    Object.assign(this, result)
    this.questions = result.questions.map(
      (question) => new ResultQuestionEntity(question),
    )
    this.test = new TestLeanEntity(result.test)
  }
}

export type ResultWithTest = Result & { test: Test }
export type ResultQuestionsWithTest = ResultQuestion & {
  result: ResultWithTest
}

export class ResultWithTestEntity implements ResultWithTest {
  id!: string

  @Exclude()
  testId!: string

  score!: number

  @Type(() => TestLeanEntity)
  test!: TestLeanEntity

  createdAt!: Date

  constructor(result: ResultWithTest) {
    Object.assign(this, result)
    this.test = new TestLeanEntity(result.test)
  }
}

export class ResultQuestionWithTestEntity implements ResultQuestionsWithTest {
  @Exclude()
  questionId!: string

  @Exclude()
  resultId!: string

  answer!: string

  isCorrect!: boolean

  @Type(() => ResultWithTestEntity)
  result!: ResultWithTestEntity

  createdAt!: Date

  constructor(resultQuestion: ResultQuestionsWithTest) {
    Object.assign(this, resultQuestion)
    this.result = new ResultWithTestEntity(resultQuestion.result)
  }
}

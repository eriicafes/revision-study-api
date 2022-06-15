import { BadRequestException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { AnswerTestDto } from '../dto/answer-test.dto'
import { TestWithQuestions } from '../entities/test.entity'
import {
  hasNoDuplicateQuestions,
  isCorrect,
  isEveryQuestionAnsweredAnValid,
  isSameLength,
} from './checks.util'

export type AnswerMarker = (test: TestWithQuestions) => Promise<{
  score: number
  answers: Prisma.AnswerCreateManyResultInput[]
}>

export const mark =
  (answerTestDto: AnswerTestDto): AnswerMarker =>
  async ({ questions }) => {
    if (!isSameLength(answerTestDto, questions))
      throw new BadRequestException('Mismatched answers found')
    if (!hasNoDuplicateQuestions(answerTestDto))
      throw new BadRequestException('Duplicate answers found')
    if (!isEveryQuestionAnsweredAnValid(answerTestDto, questions))
      throw new BadRequestException('Invalid answers found')

    const results = new Map<string, boolean>()
    let total = 0

    for (const question of questions) {
      results.set(question.id, isCorrect(answerTestDto, questions, question.id))
    }

    for (const [_questionId, isCorrect] of results) {
      total += isCorrect ? 1 : 0
    }

    return {
      score: (total / results.size) * 100,
      answers: answerTestDto.answers.map(({ answer, questionId }) => ({
        answer,
        questionId,
        isCorrect: results.get(questionId) ?? false,
      })),
    }
  }

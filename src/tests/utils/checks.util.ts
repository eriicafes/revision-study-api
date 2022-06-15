import { Question } from '@prisma/client'
import { AnswerTestDto } from '../dto/answer-test.dto'

export const isSameLength = (
  answerTestDto: AnswerTestDto,
  questions: Question[],
) => {
  const answersLength = answerTestDto.answers.length
  return answersLength === questions.length
}

export const hasNoDuplicateQuestions = (answerTestDto: AnswerTestDto) => {
  const answersSet = new Set(
    answerTestDto.answers.map((answer) => answer.questionId),
  )
  return answersSet.size === answerTestDto.answers.length
}

export const isEveryQuestionAnsweredAnValid = (
  answerTestDto: AnswerTestDto,
  questions: Question[],
) => {
  const everyQuestionExistInAnswers = questions.every((question) => {
    const answer = answerTestDto.answers.find(
      (answer) => answer.questionId === question.id,
    )
    if (!answer) return false
    const answerIsValid = [question.answer, ...question.otherOptions].includes(
      answer.answer,
    )
    return answerIsValid
  })
  return everyQuestionExistInAnswers
}

export const isCorrect = (
  answerTestDto: AnswerTestDto,
  questions: Question[],
  questionId: string,
) => {
  const answer = answerTestDto.answers.find(
    (answer) => answer.questionId === questionId,
  )
  const question = questions.find((question) => question.id === questionId)
  return question?.answer === answer?.answer
}

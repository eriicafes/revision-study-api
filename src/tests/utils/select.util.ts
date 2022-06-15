import { Answer, Question } from '@prisma/client'

type QuestionWithAnswers = Question & { answers: Answer[] }

const MAX_QUESTIONS = 30

export const selectQuestions = (questions: QuestionWithAnswers[]): string[] => {
  const overallScore = (question: QuestionWithAnswers) =>
    question.answers.reduce((acc, curr) => acc + (curr.isCorrect ? 1 : 0), 0)

  const sortedQuestions = questions.sort((a, b) => {
    return overallScore(a) - overallScore(b)
  })

  const questionIds = sortedQuestions.map((question) => question.id)
  const uniqueQuestionIds = [...new Set(questionIds)]

  return uniqueQuestionIds.slice(0, MAX_QUESTIONS)
}

import { Question } from '@prisma/client'
import { Exclude, Expose } from 'class-transformer'

export class QuestionEntity implements Question {
  id!: string

  userId!: string

  creatorId!: string | null

  content!: string

  @Exclude()
  answer!: string

  @Exclude()
  otherOptions!: string[]

  @Expose()
  get options(): string[] {
    const options = [this.answer, ...this.otherOptions]
    const shuffledOptions = options.sort(() => Math.random() - 0.5)
    return shuffledOptions
  }

  createdAt!: Date
  updatedAt!: Date

  constructor(question: Question) {
    Object.assign(this, question)
  }
}

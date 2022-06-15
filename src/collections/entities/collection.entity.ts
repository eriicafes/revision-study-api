import { Collection, Question } from '@prisma/client'
import { Type } from 'class-transformer'
import { QuestionEntity } from '~/questions/entities/question.entity'

export type CollectionWithQuestions = Collection & { questions: Question[] }

export class CollectionEntity implements CollectionWithQuestions {
  id!: string

  userId!: string

  creatorId!: string | null

  title!: string

  description!: string

  isPrivate!: boolean

  canImport!: boolean

  canClone!: boolean

  @Type(() => QuestionEntity)
  questions!: QuestionEntity[]

  createdAt!: Date
  updatedAt!: Date

  constructor(collection: CollectionWithQuestions) {
    Object.assign(this, collection)
    this.questions = collection.questions.map(
      (question) => new QuestionEntity(question),
    )
  }
}

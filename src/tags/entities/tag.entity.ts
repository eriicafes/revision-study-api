import { Tag } from '@prisma/client'
import { Type } from 'class-transformer'
import {
  CollectionEntity,
  CollectionWithQuestions,
} from '~/collections/entities/collection.entity'

export type TagWithCollections = Tag & {
  collections: CollectionWithQuestions[]
}

export class TagEntity implements TagWithCollections {
  id!: string

  userId!: string

  title!: string

  description!: string

  isPrivate!: boolean

  canImport!: boolean

  canClone!: boolean

  @Type(() => CollectionEntity)
  collections!: CollectionEntity[]

  createdAt!: Date
  updatedAt!: Date

  constructor(tag: TagWithCollections) {
    Object.assign(this, tag)
    this.collections = tag.collections.map(
      (collection) => new CollectionEntity(collection),
    )
  }
}

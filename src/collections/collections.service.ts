import { Injectable } from '@nestjs/common'
import { CollectionsRepository } from './collections.repository'
import { CreateCollectionDto } from './dto/create-collection.dto'
import { UpdateCollectionDto } from './dto/update-collection.dto'
import { CollectionEntity } from './entities/collection.entity'

@Injectable()
export class CollectionsService {
  constructor(private readonly collectionsRepository: CollectionsRepository) {}

  public async create(
    userId: string,
    createCollectionDto: CreateCollectionDto,
  ): Promise<CollectionEntity> {
    const collection = await this.collectionsRepository.create(
      userId,
      createCollectionDto,
    )

    return new CollectionEntity(collection)
  }

  public async findAll(userId: string): Promise<CollectionEntity[]> {
    const collections = await this.collectionsRepository.findAll(userId)

    return collections.map((collection) => new CollectionEntity(collection))
  }

  public async findById(userId: string, id: string): Promise<CollectionEntity> {
    const collection = await this.collectionsRepository.findById(userId, id)

    return new CollectionEntity(collection)
  }

  public async update(
    userId: string,
    id: string,
    updateCollectionDto: UpdateCollectionDto,
  ): Promise<CollectionEntity> {
    const collection = await this.collectionsRepository.update(
      userId,
      id,
      updateCollectionDto,
    )

    return new CollectionEntity(collection)
  }

  public async remove(userId: string, id: string): Promise<CollectionEntity> {
    const collection = await this.collectionsRepository.remove(userId, id)

    return new CollectionEntity(collection)
  }

  public async import(userId: string, id: string): Promise<CollectionEntity> {
    const collection = await this.collectionsRepository.import(userId, id)

    return new CollectionEntity(collection)
  }

  public async clone(userId: string, id: string): Promise<CollectionEntity> {
    const collection = await this.collectionsRepository.clone(userId, id)

    return new CollectionEntity(collection)
  }

  public async linkQuestion(
    userId: string,
    id: string,
    questionId: string,
  ): Promise<CollectionEntity> {
    const collection = await this.collectionsRepository.linkQuestion(
      userId,
      id,
      questionId,
    )

    return new CollectionEntity(collection)
  }

  public async unlinkQuestion(
    userId: string,
    id: string,
    questionId: string,
  ): Promise<CollectionEntity> {
    const collection = await this.collectionsRepository.unlinkQuestion(
      userId,
      id,
      questionId,
    )

    return new CollectionEntity(collection)
  }
}

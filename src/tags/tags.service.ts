import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateTagDto } from './dto/create-tag.dto'
import { UpdateTagDto } from './dto/update-tag.dto'
import { TagEntity } from './entities/tag.entity'
import { TagsRepository } from './tags.repository'

@Injectable()
export class TagsService {
  constructor(private readonly tagsRepository: TagsRepository) {}

  public async create(
    userId: string,
    createTagDto: CreateTagDto,
  ): Promise<TagEntity> {
    const tag = await this.tagsRepository.create(userId, createTagDto)

    return new TagEntity(tag)
  }

  public async findAll(userId: string): Promise<TagEntity[]> {
    const tags = await this.tagsRepository.findAll(userId)

    return tags.map((tag) => new TagEntity(tag))
  }

  public async findById(userId: string, id: string): Promise<TagEntity> {
    const tag = await this.tagsRepository.findById(userId, id)

    if (!tag) throw new NotFoundException()

    return new TagEntity(tag)
  }

  public async update(
    userId: string,
    id: string,
    updateTagDto: UpdateTagDto,
  ): Promise<TagEntity> {
    const tag = await this.tagsRepository.update(userId, id, updateTagDto)

    if (!tag) throw new NotFoundException()

    return new TagEntity(tag)
  }

  public async remove(userId: string, id: string): Promise<TagEntity> {
    const tag = await this.tagsRepository.remove(userId, id)

    if (!tag) throw new NotFoundException()

    return new TagEntity(tag)
  }

  public async linkCollection(
    userId: string,
    id: string,
    questionId: string,
  ): Promise<TagEntity> {
    const tag = await this.tagsRepository.linkCollection(userId, id, questionId)

    if (!tag) throw new NotFoundException()

    return new TagEntity(tag)
  }

  public async unlinkCollection(
    userId: string,
    id: string,
    questionId: string,
  ): Promise<TagEntity> {
    const tag = await this.tagsRepository.unlinkCollection(
      userId,
      id,
      questionId,
    )

    if (!tag) throw new NotFoundException()

    return new TagEntity(tag)
  }
}

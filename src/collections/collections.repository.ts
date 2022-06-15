import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '~/core/services/prisma.service'
import { stripForCloneOrImport } from '~/utils/clone-or-import-model'
import { CollectionWithQuestions } from './entities/collection.entity'

@Injectable()
export class CollectionsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(
    userId: string,
    createCollectionData: Omit<
      Prisma.CollectionCreateInput,
      'user' | 'creator'
    >,
  ): Promise<CollectionWithQuestions> {
    return this.prismaService.collection.create({
      include: {
        questions: true,
      },
      data: {
        ...createCollectionData,
        creatorId: userId,
        userId,
      },
    })
  }

  public async findAll(userId: string): Promise<CollectionWithQuestions[]> {
    return this.prismaService.collection.findMany({
      where: { userId },
      include: {
        questions: true,
      },
    })
  }

  public async findById(
    userId: string,
    id: string,
  ): Promise<CollectionWithQuestions> {
    const collection = await this.prismaService.collection.findUnique({
      where: { id },
      include: {
        questions: true,
      },
    })

    if (!collection) throw new NotFoundException('Collection not found')
    if (collection.userId !== userId) throw new ForbiddenException()

    return collection
  }

  public async update(
    userId: string,
    id: string,
    updateCollectionData: Omit<
      Prisma.CollectionUpdateInput,
      'user' | 'creator'
    >,
  ): Promise<CollectionWithQuestions> {
    const collection = await this.prismaService.collection.findUnique({
      where: { id },
    })

    if (!collection) throw new NotFoundException('Collection not found')
    if (collection.userId !== userId) throw new ForbiddenException()

    return this.prismaService.collection.update({
      where: { id: collection.id },
      include: {
        questions: true,
      },
      data: updateCollectionData,
    })
  }

  public async remove(
    userId: string,
    id: string,
  ): Promise<CollectionWithQuestions> {
    const collection = await this.prismaService.collection.findUnique({
      where: { id },
    })

    if (!collection) throw new NotFoundException('Collection not found')
    if (collection.userId !== userId) throw new ForbiddenException()

    return this.prismaService.collection.delete({
      where: { id: collection.id },
      include: {
        questions: true,
      },
    })
  }

  public async import(
    userId: string,
    id: string,
  ): Promise<CollectionWithQuestions> {
    const collection = await this.prismaService.collection.findUnique({
      include: {
        questions: true,
      },
      where: { id },
    })

    if (!collection) throw new NotFoundException('Collection not found')
    if (collection.userId === userId) throw new ForbiddenException()

    if (collection.isPrivate)
      throw new ForbiddenException('Collection is private')
    if (!collection.canImport)
      throw new ForbiddenException('Collection cannot be imported')

    return this.prismaService.collection.create({
      include: {
        questions: true,
      },
      data: {
        ...stripForCloneOrImport(collection),
        creatorId: collection.creatorId ?? collection.userId,
        userId,
        questions: {
          create: collection.questions.map((question) => ({
            ...stripForCloneOrImport(question),
            creatorId: question.creatorId ?? question.userId,
            userId,
          })),
        },
      },
    })
  }

  public async clone(
    userId: string,
    id: string,
  ): Promise<CollectionWithQuestions> {
    const collection = await this.prismaService.collection.findUnique({
      include: {
        questions: true,
      },
      where: { id },
    })

    if (!collection) throw new NotFoundException('Collection not found')
    if (collection.userId === userId) throw new ForbiddenException()

    if (collection.isPrivate)
      throw new ForbiddenException('Collection is private')
    if (!collection.canClone)
      throw new ForbiddenException('Collection cannot be cloned')

    return this.prismaService.collection.create({
      include: {
        questions: true,
      },
      data: {
        ...stripForCloneOrImport(collection),
        creatorId: userId,
        userId,
        questions: {
          create: collection.questions.map((question) => ({
            ...stripForCloneOrImport(question),
            creatorId: userId,
            userId,
          })),
        },
      },
    })
  }

  public async linkQuestion(
    userId: string,
    id: string,
    questionId: string,
  ): Promise<CollectionWithQuestions> {
    const collection = await this.prismaService.collection.findUnique({
      where: { id },
    })

    if (!collection) throw new NotFoundException('Collection not found')
    if (collection.userId !== userId) throw new ForbiddenException()

    const question = await this.prismaService.question.findUnique({
      where: { id: questionId },
    })

    if (!question) throw new NotFoundException('Question not found')
    if (question.userId !== userId) throw new ForbiddenException()

    return this.prismaService.collection.update({
      where: { id: collection.id },
      include: {
        questions: true,
      },
      data: {
        questions: {
          connect: { id: question.id },
        },
      },
    })
  }

  public async unlinkQuestion(
    userId: string,
    id: string,
    questionId: string,
  ): Promise<CollectionWithQuestions> {
    const collection = await this.prismaService.collection.findUnique({
      where: { id },
    })

    if (!collection) throw new NotFoundException('Collection not found')
    if (collection.userId !== userId) throw new ForbiddenException()

    const question = await this.prismaService.question.findUnique({
      where: { id: questionId },
    })

    if (!question) throw new NotFoundException('Question not found')
    if (question.userId !== userId) throw new ForbiddenException()

    return this.prismaService.collection.update({
      where: { id: collection.id },
      include: {
        questions: true,
      },
      data: {
        questions: {
          disconnect: { id: question.id },
        },
      },
    })
  }
}

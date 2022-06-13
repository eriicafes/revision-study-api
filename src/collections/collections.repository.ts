import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '~/core/services/prisma.service'

@Injectable()
export class CollectionsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(
    userId: string,
    createCollectionData: Omit<Prisma.CollectionCreateInput, 'user'>,
  ) {
    return this.prismaService.collection.create({
      include: {
        questions: true,
      },
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        ...createCollectionData,
      },
    })
  }

  public async findAll(userId: string) {
    return this.prismaService.collection.findMany({
      where: { userId },
      include: {
        questions: true,
      },
    })
  }

  public async findById(userId: string, id: string) {
    const collection = await this.prismaService.collection.findUnique({
      where: { id },
      include: {
        questions: true,
      },
    })

    if (!collection) return null
    if (collection.userId !== userId) return null

    return collection
  }

  public async update(
    userId: string,
    id: string,
    updateCollectionData: Omit<Prisma.CollectionUpdateInput, 'user'>,
  ) {
    const collection = await this.prismaService.collection.findUnique({
      where: { id },
    })

    if (!collection) return null
    if (collection.userId !== userId) return null

    return this.prismaService.collection.update({
      where: { id: collection.id },
      include: {
        questions: true,
      },
      data: updateCollectionData,
    })
  }

  public async remove(userId: string, id: string) {
    const collection = await this.prismaService.collection.findUnique({
      where: { id },
    })

    if (!collection) return null
    if (collection.userId !== userId) return null

    return this.prismaService.collection.delete({
      where: { id: collection.id },
      include: {
        questions: true,
      },
    })
  }

  public async linkQuestion(userId: string, id: string, questionId: string) {
    const collection = await this.prismaService.collection.findUnique({
      where: { id },
    })

    if (!collection) return null
    if (collection.userId !== userId) return null

    const question = await this.prismaService.question.findUnique({
      where: { id: questionId },
    })

    if (!question) return null
    if (question.userId !== userId) return null

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

  public async unlinkQuestion(userId: string, id: string, questionId: string) {
    const collection = await this.prismaService.collection.findUnique({
      where: { id },
    })

    if (!collection) return null
    if (collection.userId !== userId) return null

    const question = await this.prismaService.question.findUnique({
      where: { id: questionId },
    })

    if (!question) return null
    if (question.userId !== userId) return null

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

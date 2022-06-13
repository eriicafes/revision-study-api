import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '~/core/services/prisma.service'

@Injectable()
export class QuestionsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(
    userId: string,
    createQuestionData: Omit<Prisma.QuestionCreateInput, 'user'>,
  ) {
    return this.prismaService.question.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        ...createQuestionData,
      },
    })
  }

  public async results(userId: string, id: string) {
    const question = await this.prismaService.question.findUnique({
      where: { id },
    })

    if (!question) return null
    if (question.userId !== userId) return null

    return this.prismaService.resultQuestion.findMany({
      where: {
        question: { id },
      },
      include: {
        result: {
          include: {
            test: true,
          },
        },
      },
    })
  }

  public async findAll(userId: string) {
    return this.prismaService.question.findMany({
      where: { userId },
    })
  }

  public async findById(userId: string, id: string) {
    const question = await this.prismaService.question.findUnique({
      where: { id },
    })

    if (!question) return null
    if (question.userId !== userId) return null

    return question
  }

  public async update(
    userId: string,
    id: string,
    updateQuestionData: Omit<Prisma.QuestionUpdateInput, 'user'>,
  ) {
    const question = await this.prismaService.question.findUnique({
      where: { id },
    })

    if (!question) return null
    if (question.userId !== userId) return null

    return this.prismaService.question.update({
      where: { id: question.id },
      data: updateQuestionData,
    })
  }

  public async remove(userId: string, id: string) {
    const question = await this.prismaService.question.findUnique({
      where: { id },
    })

    if (!question) return null
    if (question.userId !== userId) return null

    return this.prismaService.question.delete({
      where: { id: question.id },
    })
  }
}

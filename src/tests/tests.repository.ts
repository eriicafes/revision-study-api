import { Injectable } from '@nestjs/common'
import { Prisma, Question, Test } from '@prisma/client'
import { PrismaService } from '~/core/services/prisma.service'

export type AnswerMarker = (test: Test & { questions: Question[] }) => Promise<{
  score: number
  results: Prisma.ResultQuestionCreateManyResultInput[]
}>

@Injectable()
export class TestsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(
    userId: string,
    createTestData: Omit<Prisma.TestCreateInput, 'user' | 'questions'> & {
      questionIds: string[]
    },
  ) {
    const { questionIds, ...testData } = createTestData

    return this.prismaService.test.create({
      include: {
        questions: true,
      },
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        questions: {
          connect: questionIds.map((questionId) => ({ id: questionId })),
        },
        ...testData,
      },
    })
  }

  public async answer(userId: string, id: string, mark: AnswerMarker) {
    const test = await this.prismaService.test.findUnique({
      where: { id },
      include: {
        questions: true,
      },
    })

    if (!test) return null
    if (test.userId !== userId) return null

    const { score, results } = await mark(test)

    return this.prismaService.result.create({
      include: {
        questions: {
          include: {
            question: true,
          },
        },
        test: true,
      },
      data: {
        score,
        test: {
          connect: { id },
        },
        questions: {
          createMany: {
            data: results,
          },
        },
      },
    })
  }

  public async results(userId: string, id: string) {
    const test = await this.prismaService.test.findUnique({
      where: { id },
    })

    if (!test) return null
    if (test.userId !== userId) return null

    return this.prismaService.result.findMany({
      where: { testId: test.id },
      include: {
        questions: {
          include: {
            question: true,
          },
        },
        test: true,
      },
    })
  }

  public async findAll(userId: string) {
    return this.prismaService.test.findMany({
      where: { userId },
      include: {
        _count: {
          select: {
            questions: true,
          },
        },
      },
    })
  }

  public async findById(userId: string, id: string) {
    const test = await this.prismaService.test.findUnique({
      where: { id },
      include: {
        questions: true,
      },
    })

    if (!test) return null
    if (test.userId !== userId) return null

    return test
  }

  public async update(
    userId: string,
    id: string,
    updateTestData: Omit<Prisma.TestUpdateInput, 'user'>,
  ) {
    const test = await this.prismaService.test.findUnique({
      where: { id },
    })

    if (!test) return null
    if (test.userId !== userId) return null

    return this.prismaService.test.update({
      where: { id: test.id },
      include: {
        questions: true,
      },
      data: updateTestData,
    })
  }

  public async remove(userId: string, id: string) {
    const test = await this.prismaService.test.findUnique({
      where: { id },
    })

    if (!test) return null
    if (test.userId !== userId) return null

    return this.prismaService.test.delete({
      where: { id: test.id },
      include: {
        questions: true,
      },
    })
  }
}

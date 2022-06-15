import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '~/core/services/prisma.service'
import { ResultWithAnswers } from './entities/result.entity'
import { TestWithQuestions } from './entities/test.entity'
import { AnswerMarker } from './utils/mark.util'
import { selectQuestions } from './utils/select.util'

@Injectable()
export class TestsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async createOnCollection(
    userId: string,
    collectionId: string,
    createTestData: Omit<Prisma.TestCreateInput, 'user' | 'questions'>,
  ): Promise<TestWithQuestions> {
    const collection = await this.prismaService.collection.findUnique({
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
      },
      where: { id: collectionId },
    })

    if (!collection) throw new NotFoundException('Collection not found')
    if (collection.userId !== userId) throw new ForbiddenException()

    if (collection.questions.length === 0)
      throw new BadRequestException('Collection questions empty')

    const questionIds = selectQuestions(collection.questions)

    return this.prismaService.test.create({
      include: {
        questions: true,
      },
      data: {
        ...createTestData,
        userId,
        questions: {
          connect: questionIds.map((questionId) => ({ id: questionId })),
        },
      },
    })
  }

  public async createOnTag(
    userId: string,
    tagId: string,
    createTestData: Omit<Prisma.TestCreateInput, 'user' | 'questions'>,
  ): Promise<TestWithQuestions> {
    const tag = await this.prismaService.tag.findUnique({
      include: {
        collections: {
          include: {
            questions: {
              include: {
                answers: true,
              },
            },
          },
        },
      },
      where: { id: tagId },
    })

    if (!tag) throw new NotFoundException('Tag not found')
    if (tag.userId !== userId) throw new ForbiddenException()

    const tagQuestions = tag.collections.flatMap((collection) =>
      collection.questions.map((question) => question),
    )
    if (tagQuestions.length === 0)
      throw new BadRequestException('Tag questions empty')

    const questionIds = selectQuestions(tagQuestions)

    return this.prismaService.test.create({
      include: {
        questions: true,
      },
      data: {
        ...createTestData,
        userId,
        questions: {
          connect: questionIds.map((questionId) => ({ id: questionId })),
        },
      },
    })
  }

  public async answer(
    userId: string,
    id: string,
    mark: AnswerMarker,
  ): Promise<ResultWithAnswers> {
    const test = await this.prismaService.test.findUnique({
      where: { id },
      include: {
        questions: true,
      },
    })

    if (!test) throw new NotFoundException('Test not found')
    if (test.userId !== userId) throw new ForbiddenException()

    const { score, answers } = await mark(test)

    return this.prismaService.result.create({
      include: {
        answers: {
          include: {
            question: true,
          },
        },
      },
      data: {
        score,
        test: {
          connect: { id },
        },
        answers: {
          createMany: {
            data: answers,
          },
        },
      },
    })
  }

  public async results(
    userId: string,
    id: string,
  ): Promise<ResultWithAnswers[]> {
    const test = await this.prismaService.test.findUnique({
      where: { id },
    })

    if (!test) throw new NotFoundException('Test not found')
    if (test.userId !== userId) throw new ForbiddenException()

    return this.prismaService.result.findMany({
      where: { testId: test.id },
      include: {
        answers: {
          include: {
            question: true,
          },
        },
      },
    })
  }

  public async findAll(userId: string): Promise<TestWithQuestions[]> {
    return this.prismaService.test.findMany({
      where: { userId },
      include: {
        questions: true,
      },
    })
  }

  public async findById(
    userId: string,
    id: string,
  ): Promise<TestWithQuestions> {
    const test = await this.prismaService.test.findUnique({
      where: { id },
      include: {
        questions: true,
      },
    })

    if (!test) throw new NotFoundException('Test not found')
    if (test.userId !== userId) throw new ForbiddenException()

    return test
  }

  public async update(
    userId: string,
    id: string,
    updateTestData: Omit<Prisma.TestUpdateInput, 'user'>,
  ): Promise<TestWithQuestions> {
    const test = await this.prismaService.test.findUnique({
      where: { id },
    })

    if (!test) throw new NotFoundException('Test not found')
    if (test.userId !== userId) throw new ForbiddenException()

    return this.prismaService.test.update({
      where: { id: test.id },
      include: {
        questions: true,
      },
      data: updateTestData,
    })
  }

  public async remove(userId: string, id: string): Promise<TestWithQuestions> {
    const test = await this.prismaService.test.findUnique({
      where: { id },
    })

    if (!test) throw new NotFoundException('Test not found')
    if (test.userId !== userId) throw new ForbiddenException()

    return this.prismaService.test.delete({
      where: { id: test.id },
      include: {
        questions: true,
      },
    })
  }
}

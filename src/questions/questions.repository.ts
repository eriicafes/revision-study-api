import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Answer, Prisma, Question } from '@prisma/client'
import { PrismaService } from '~/core/services/prisma.service'

@Injectable()
export class QuestionsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(
    userId: string,
    createQuestionData: Omit<Prisma.QuestionCreateInput, 'user' | 'creator'>,
  ): Promise<Question> {
    return this.prismaService.question.create({
      data: {
        ...createQuestionData,
        creatorId: userId,
        userId,
      },
    })
  }

  public async answers(userId: string, id: string): Promise<Answer[]> {
    const question = await this.prismaService.question.findUnique({
      where: { id },
    })

    if (!question) throw new NotFoundException('Question not found')
    if (question.userId !== userId) throw new ForbiddenException()

    return this.prismaService.answer.findMany({
      where: {
        question: { id },
      },
    })
  }

  public async findAll(userId: string): Promise<Question[]> {
    return this.prismaService.question.findMany({
      where: { userId },
    })
  }

  public async findById(userId: string, id: string): Promise<Question> {
    const question = await this.prismaService.question.findUnique({
      where: { id },
    })

    if (!question) throw new NotFoundException('Question not found')
    if (question.userId !== userId) throw new ForbiddenException()

    return question
  }

  public async update(
    userId: string,
    id: string,
    updateQuestionData: Omit<Prisma.QuestionUpdateInput, 'user' | 'creator'>,
  ): Promise<Question> {
    const question = await this.prismaService.question.findUnique({
      where: { id },
    })

    if (!question) throw new NotFoundException('Question not found')
    if (question.userId !== userId) throw new ForbiddenException()

    return this.prismaService.question.update({
      where: { id: question.id },
      data: updateQuestionData,
    })
  }

  public async remove(userId: string, id: string): Promise<Question> {
    const question = await this.prismaService.question.findUnique({
      where: { id },
    })

    if (!question) throw new NotFoundException('Question not found')
    if (question.userId !== userId) throw new ForbiddenException()

    return this.prismaService.question.delete({
      where: { id: question.id },
    })
  }
}

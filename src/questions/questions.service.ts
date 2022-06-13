import { Injectable, NotFoundException } from '@nestjs/common'
import { ResultQuestionWithTestEntity } from '~/tests/entities/result.entity'
import { CreateQuestionDto } from './dto/create-question.dto'
import { UpdateQuestionDto } from './dto/update-question.dto'
import { QuestionEntity } from './entities/question.entity'
import { QuestionsRepository } from './questions.repository'

@Injectable()
export class QuestionsService {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  public async create(
    userId: string,
    createQuestionDto: CreateQuestionDto,
  ): Promise<QuestionEntity> {
    const question = await this.questionsRepository.create(
      userId,
      createQuestionDto,
    )

    return new QuestionEntity(question)
  }
  public async results(
    userId: string,
    id: string,
  ): Promise<ResultQuestionWithTestEntity[]> {
    const results = await this.questionsRepository.results(userId, id)

    if (!results) throw new NotFoundException()

    return results.map((result) => new ResultQuestionWithTestEntity(result))
  }

  public async findAll(userId: string): Promise<QuestionEntity[]> {
    const questions = await this.questionsRepository.findAll(userId)

    return questions.map((question) => new QuestionEntity(question))
  }

  public async findById(userId: string, id: string): Promise<QuestionEntity> {
    const question = await this.questionsRepository.findById(userId, id)

    if (!question) throw new NotFoundException()

    return new QuestionEntity(question)
  }

  public async update(
    userId: string,
    id: string,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<QuestionEntity> {
    const question = await this.questionsRepository.update(
      userId,
      id,
      updateQuestionDto,
    )

    if (!question) throw new NotFoundException()

    return new QuestionEntity(question)
  }

  public async remove(userId: string, id: string): Promise<QuestionEntity> {
    const question = await this.questionsRepository.remove(userId, id)

    if (!question) throw new NotFoundException()

    return new QuestionEntity(question)
  }
}

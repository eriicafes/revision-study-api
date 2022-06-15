import { Injectable } from '@nestjs/common'
import { CreateQuestionDto } from './dto/create-question.dto'
import { UpdateQuestionDto } from './dto/update-question.dto'
import { AnswerLeanEntity } from './entities/answer.entity'
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

  public async answers(
    userId: string,
    id: string,
  ): Promise<AnswerLeanEntity[]> {
    const answers = await this.questionsRepository.answers(userId, id)

    return answers.map((answer) => new AnswerLeanEntity(answer))
  }

  public async findAll(userId: string): Promise<QuestionEntity[]> {
    const questions = await this.questionsRepository.findAll(userId)

    return questions.map((question) => new QuestionEntity(question))
  }

  public async findById(userId: string, id: string): Promise<QuestionEntity> {
    const question = await this.questionsRepository.findById(userId, id)

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

    return new QuestionEntity(question)
  }

  public async remove(userId: string, id: string): Promise<QuestionEntity> {
    const question = await this.questionsRepository.remove(userId, id)

    return new QuestionEntity(question)
  }
}

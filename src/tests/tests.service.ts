import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Question } from '@prisma/client'
import { CollectionsRepository } from '~/collections/collections.repository'
import { TagsRepository } from '~/tags/tags.repository'
import { AnswerTestDto } from './dto/answer-test.dto'
import { CreateTestDto } from './dto/create-test.dto'
import { UpdateTestDto } from './dto/update-test.dto'
import { ResultEntity } from './entities/result.entity'
import { TestEntity, TestWithCountEntity } from './entities/test.entity'
import { TestsRepository } from './tests.repository'

@Injectable()
export class TestsService {
  constructor(
    private readonly testsRepository: TestsRepository,
    private readonly collectionsRepository: CollectionsRepository,
    private readonly tagsRepository: TagsRepository,
  ) {}

  public async createOnCollection(
    userId: string,
    collectionId: string,
    createTestDto: CreateTestDto,
  ): Promise<TestEntity> {
    const collection = await this.collectionsRepository.findById(
      userId,
      collectionId,
    )

    if (!collection) throw new NotFoundException()

    const createTestData = {
      ...createTestDto,
      questionIds: collection.questions.map((question) => question.id),
    }

    if (createTestData.questionIds.length === 0)
      throw new BadRequestException('No questions')

    const test = await this.testsRepository.create(userId, createTestData)

    return new TestEntity(test)
  }

  public async createOnTag(
    userId: string,
    tagId: string,
    createTestDto: CreateTestDto,
  ): Promise<TestEntity> {
    const tag = await this.tagsRepository.findById(userId, tagId)

    if (!tag) throw new NotFoundException()

    const createTestData = {
      ...createTestDto,
      questionIds: tag.collections.flatMap((collection) =>
        collection.questions.map((question) => question.id),
      ),
    }

    if (createTestData.questionIds.length === 0)
      throw new BadRequestException('No questions')

    const test = await this.testsRepository.create(userId, createTestData)

    return new TestEntity(test)
  }

  public async answer(
    userId: string,
    id: string,
    answerTestDto: AnswerTestDto,
  ) {
    const isSameLength = (questions: Question[]) => {
      const answersLength = answerTestDto.answers.length
      return answersLength === questions.length
    }

    const hasNoDuplicateQuestions = () => {
      const answersSet = new Set(
        answerTestDto.answers.map((answer) => answer.questionId),
      )
      return answersSet.size === answerTestDto.answers.length
    }

    const isEveryQuestionAnsweredAnValid = (questions: Question[]) => {
      const everyQuestionExistInAnswers = questions.every((question) => {
        const answer = answerTestDto.answers.find(
          (answer) => answer.questionId === question.id,
        )
        if (!answer) return false
        const answerIsValid = [
          question.answer,
          ...question.otherOptions,
        ].includes(answer.answer)
        return answerIsValid
      })
      return everyQuestionExistInAnswers
    }

    const isCorrect = (questions: Question[], questionId: string) => {
      const answer = answerTestDto.answers.find(
        (answer) => answer.questionId === questionId,
      )
      return (
        questions.find((question) => question.id === questionId)?.answer ===
        answer?.answer
      )
    }

    const score = (questions: Question[]) => {
      const total = questions
        .map<number>((question) => (isCorrect(questions, question.id) ? 1 : 0))
        .reduce((acc, curr) => acc + curr, 0)

      return (total / questions.length) * 100
    }

    const result = await this.testsRepository.answer(
      userId,
      id,
      async ({ questions }) => {
        if (!isSameLength(questions))
          throw new BadRequestException('Mismatched answers found')
        if (!hasNoDuplicateQuestions())
          throw new BadRequestException('Duplicate answers found')
        if (!isEveryQuestionAnsweredAnValid(questions))
          throw new BadRequestException('Invalid answers found')

        return {
          score: score(questions),
          results: answerTestDto.answers.map(({ answer, questionId }) => ({
            answer,
            questionId,
            isCorrect: isCorrect(questions, questionId),
          })),
        }
      },
    )

    if (!result) throw new NotFoundException()

    return new ResultEntity(result)
  }

  public async results(userId: string, id: string) {
    const results = await this.testsRepository.results(userId, id)

    if (!results) throw new NotFoundException()

    return results.map((result) => new ResultEntity(result))
  }

  public async findAll(userId: string): Promise<TestWithCountEntity[]> {
    const tests = await this.testsRepository.findAll(userId)

    const testsWithQuestionCount = tests.map(({ _count, ...test }) => ({
      ...test,
      questionsCount: _count.questions,
    }))

    return testsWithQuestionCount.map((test) => new TestWithCountEntity(test))
  }

  public async findById(userId: string, id: string): Promise<TestEntity> {
    const test = await this.testsRepository.findById(userId, id)

    if (!test) throw new NotFoundException()

    return new TestEntity(test)
  }

  public async update(
    userId: string,
    id: string,
    updateTestDto: UpdateTestDto,
  ): Promise<TestEntity> {
    const test = await this.testsRepository.update(userId, id, updateTestDto)

    if (!test) throw new NotFoundException()

    return new TestEntity(test)
  }

  public async remove(userId: string, id: string): Promise<TestEntity> {
    const test = await this.testsRepository.remove(userId, id)

    if (!test) throw new NotFoundException()

    return new TestEntity(test)
  }
}

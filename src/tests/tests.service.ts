import { Injectable } from '@nestjs/common'
import { AnswerTestDto } from './dto/answer-test.dto'
import { CreateTestDto } from './dto/create-test.dto'
import { UpdateTestDto } from './dto/update-test.dto'
import { ResultEntity } from './entities/result.entity'
import { TestEntity } from './entities/test.entity'
import { TestsRepository } from './tests.repository'
import { mark } from './utils/mark.util'

@Injectable()
export class TestsService {
  constructor(private readonly testsRepository: TestsRepository) {}

  public async createOnCollection(
    userId: string,
    collectionId: string,
    createTestDto: CreateTestDto,
  ): Promise<TestEntity> {
    const test = await this.testsRepository.createOnCollection(
      userId,
      collectionId,
      createTestDto,
    )

    return new TestEntity(test)
  }

  public async createOnTag(
    userId: string,
    tagId: string,
    createTestDto: CreateTestDto,
  ): Promise<TestEntity> {
    const test = await this.testsRepository.createOnTag(
      userId,
      tagId,
      createTestDto,
    )

    return new TestEntity(test)
  }

  public async answer(
    userId: string,
    id: string,
    answerTestDto: AnswerTestDto,
  ): Promise<ResultEntity> {
    const result = await this.testsRepository.answer(
      userId,
      id,
      mark(answerTestDto),
    )

    return new ResultEntity(result)
  }

  public async results(userId: string, id: string): Promise<ResultEntity[]> {
    const results = await this.testsRepository.results(userId, id)

    return results.map((result) => new ResultEntity(result))
  }

  public async findAll(userId: string): Promise<TestEntity[]> {
    const tests = await this.testsRepository.findAll(userId)

    return tests.map((test) => new TestEntity(test))
  }

  public async findById(userId: string, id: string): Promise<TestEntity> {
    const test = await this.testsRepository.findById(userId, id)

    return new TestEntity(test)
  }

  public async update(
    userId: string,
    id: string,
    updateTestDto: UpdateTestDto,
  ): Promise<TestEntity> {
    const test = await this.testsRepository.update(userId, id, updateTestDto)

    return new TestEntity(test)
  }

  public async remove(userId: string, id: string): Promise<TestEntity> {
    const test = await this.testsRepository.remove(userId, id)

    return new TestEntity(test)
  }
}

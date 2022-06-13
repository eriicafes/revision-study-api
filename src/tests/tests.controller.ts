import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import { User } from '~/auth/decorators/user.decorator'
import { UserEntity } from '~/users/entities/user.entity'
import { AnswerTestDto } from './dto/answer-test.dto'
import { CreateTestDto } from './dto/create-test.dto'
import { UpdateTestDto } from './dto/update-test.dto'
import { TestsService } from './tests.service'

@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @Post('take/collection/:collectionId')
  createOnCollection(
    @User() user: UserEntity,
    @Param('collectionId') collectionId: string,
    @Body() createTestDto: CreateTestDto,
  ) {
    return this.testsService.createOnCollection(
      user.id,
      collectionId,
      createTestDto,
    )
  }

  @Post('take/tag/:tagId')
  createOnTag(
    @User() user: UserEntity,
    @Param('tagId') tagId: string,
    @Body() createTestDto: CreateTestDto,
  ) {
    return this.testsService.createOnTag(user.id, tagId, createTestDto)
  }

  @Post('answer/:id')
  answer(
    @User() user: UserEntity,
    @Param('id') id: string,
    @Body() answerTestDto: AnswerTestDto,
  ) {
    return this.testsService.answer(user.id, id, answerTestDto)
  }

  @Get('results/:id')
  results(@User() user: UserEntity, @Param('id') id: string) {
    return this.testsService.results(user.id, id)
  }

  @Get()
  findAll(@User() user: UserEntity) {
    return this.testsService.findAll(user.id)
  }

  @Get(':id')
  findById(@User() user: UserEntity, @Param('id') id: string) {
    return this.testsService.findById(user.id, id)
  }

  @Patch(':id')
  update(
    @User() user: UserEntity,
    @Param('id') id: string,
    @Body() updateTagDto: UpdateTestDto,
  ) {
    return this.testsService.update(user.id, id, updateTagDto)
  }

  @Delete(':id')
  remove(@User() user: UserEntity, @Param('id') id: string) {
    return this.testsService.remove(user.id, id)
  }
}

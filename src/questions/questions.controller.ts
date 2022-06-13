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
import { CreateQuestionDto } from './dto/create-question.dto'
import { UpdateQuestionDto } from './dto/update-question.dto'
import { QuestionsService } from './questions.service'

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  create(
    @User() user: UserEntity,
    @Body() createQuestionDto: CreateQuestionDto,
  ) {
    return this.questionsService.create(user.id, createQuestionDto)
  }

  @Get(':id/results')
  results(@User() user: UserEntity, @Param('id') id: string) {
    return this.questionsService.results(user.id, id)
  }

  @Get()
  findAll(@User() user: UserEntity) {
    return this.questionsService.findAll(user.id)
  }

  @Get(':id')
  findById(@User() user: UserEntity, @Param('id') id: string) {
    return this.questionsService.findById(user.id, id)
  }

  @Patch(':id')
  update(
    @User() user: UserEntity,
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionsService.update(user.id, id, updateQuestionDto)
  }

  @Delete(':id')
  remove(@User() user: UserEntity, @Param('id') id: string) {
    return this.questionsService.remove(user.id, id)
  }
}

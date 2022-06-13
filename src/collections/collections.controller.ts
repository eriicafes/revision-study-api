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
import { CollectionsService } from './collections.service'
import { CreateCollectionDto } from './dto/create-collection.dto'
import { LinkCollectionQuestionDto } from './dto/link-collection-question.dto'
import { UpdateCollectionDto } from './dto/update-collection.dto'

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post()
  create(
    @User() user: UserEntity,
    @Body() createCollectionDto: CreateCollectionDto,
  ) {
    return this.collectionsService.create(user.id, createCollectionDto)
  }

  @Get()
  findAll(@User() user: UserEntity) {
    return this.collectionsService.findAll(user.id)
  }

  @Get(':id')
  findById(@User() user: UserEntity, @Param('id') id: string) {
    return this.collectionsService.findById(user.id, id)
  }

  @Patch(':id')
  update(
    @User() user: UserEntity,
    @Param('id') id: string,
    @Body() updateCollectionDto: UpdateCollectionDto,
  ) {
    return this.collectionsService.update(user.id, id, updateCollectionDto)
  }

  @Delete(':id')
  remove(@User() user: UserEntity, @Param('id') id: string) {
    return this.collectionsService.remove(user.id, id)
  }

  @Post(':id/questions/link')
  linkQuestion(
    @User() user: UserEntity,
    @Param('id') id: string,
    @Body() linkCollectionQuestionDto: LinkCollectionQuestionDto,
  ) {
    return this.collectionsService.linkQuestion(
      user.id,
      id,
      linkCollectionQuestionDto.questionId,
    )
  }

  @Post(':id/questions/unlink')
  unlinkQuestion(
    @User() user: UserEntity,
    @Param('id') id: string,
    @Body() linkCollectionQuestionDto: LinkCollectionQuestionDto,
  ) {
    return this.collectionsService.unlinkQuestion(
      user.id,
      id,
      linkCollectionQuestionDto.questionId,
    )
  }
}

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
import { CreateTagDto } from './dto/create-tag.dto'
import { LinkTagCollectionDto } from './dto/link-tag-collection.dto'
import { UpdateTagDto } from './dto/update-tag.dto'
import { TagsService } from './tags.service'

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  create(@User() user: UserEntity, @Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(user.id, createTagDto)
  }

  @Get()
  findAll(@User() user: UserEntity) {
    return this.tagsService.findAll(user.id)
  }

  @Get(':id')
  findById(@User() user: UserEntity, @Param('id') id: string) {
    return this.tagsService.findById(user.id, id)
  }

  @Patch(':id')
  update(
    @User() user: UserEntity,
    @Param('id') id: string,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    return this.tagsService.update(user.id, id, updateTagDto)
  }

  @Delete(':id')
  remove(@User() user: UserEntity, @Param('id') id: string) {
    return this.tagsService.remove(user.id, id)
  }

  @Post(':id/collections/link')
  linkCollection(
    @User() user: UserEntity,
    @Param('id') id: string,
    @Body() linkTagCollectionDto: LinkTagCollectionDto,
  ) {
    return this.tagsService.linkCollection(
      user.id,
      id,
      linkTagCollectionDto.collectionId,
    )
  }

  @Post(':id/collections/unlink')
  unlinkCollection(
    @User() user: UserEntity,
    @Param('id') id: string,
    @Body() linkTagCollectionDto: LinkTagCollectionDto,
  ) {
    return this.tagsService.unlinkCollection(
      user.id,
      id,
      linkTagCollectionDto.collectionId,
    )
  }
}

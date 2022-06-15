import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '~/core/services/prisma.service'
import { stripForCloneOrImport } from '~/utils/clone-or-import-model'
import { TagWithCollections } from './entities/tag.entity'

@Injectable()
export class TagsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(
    userId: string,
    createTagData: Omit<Prisma.TagCreateInput, 'user' | 'creator'>,
  ): Promise<TagWithCollections> {
    return this.prismaService.tag.create({
      include: {
        collections: {
          include: {
            questions: true,
          },
        },
      },
      data: {
        ...createTagData,
        creatorId: userId,
        userId,
      },
    })
  }

  public async findAll(userId: string): Promise<TagWithCollections[]> {
    return this.prismaService.tag.findMany({
      where: { userId },
      include: {
        collections: {
          include: {
            questions: true,
          },
        },
      },
    })
  }

  public async findById(
    userId: string,
    id: string,
  ): Promise<TagWithCollections> {
    const tag = await this.prismaService.tag.findUnique({
      where: { id },
      include: {
        collections: {
          include: {
            questions: true,
          },
        },
      },
    })

    if (!tag) throw new NotFoundException('Tag not found')
    if (tag.userId !== userId) throw new ForbiddenException()

    return tag
  }

  public async update(
    userId: string,
    id: string,
    updateTagData: Omit<Prisma.TagUpdateInput, 'user' | 'creator'>,
  ): Promise<TagWithCollections> {
    const tag = await this.prismaService.tag.findUnique({
      where: { id },
    })

    if (!tag) throw new NotFoundException('Tag not found')
    if (tag.userId !== userId) throw new ForbiddenException()

    return this.prismaService.tag.update({
      where: { id: tag.id },
      include: {
        collections: {
          include: {
            questions: true,
          },
        },
      },
      data: updateTagData,
    })
  }

  public async remove(userId: string, id: string): Promise<TagWithCollections> {
    const tag = await this.prismaService.tag.findUnique({
      where: { id },
    })

    if (!tag) throw new NotFoundException('Tag not found')
    if (tag.userId !== userId) throw new ForbiddenException()

    return this.prismaService.tag.delete({
      where: { id: tag.id },
      include: {
        collections: {
          include: {
            questions: true,
          },
        },
      },
    })
  }

  public async import(userId: string, id: string): Promise<TagWithCollections> {
    const tag = await this.prismaService.tag.findUnique({
      include: {
        collections: {
          include: {
            questions: true,
          },
        },
      },
      where: { id },
    })

    if (!tag) throw new NotFoundException('Tag not found')
    if (tag.userId !== userId) throw new ForbiddenException()

    if (tag.isPrivate) throw new ForbiddenException('Tag is private')
    if (!tag.canImport) throw new ForbiddenException('Tag cannot be imported')

    const collectionsPromises = tag.collections.map((collection) => {
      return this.prismaService.collection.create({
        select: {
          id: true,
        },
        data: {
          ...stripForCloneOrImport(collection),
          creatorId: collection.creatorId ?? collection.userId,
          userId,
          questions: {
            create: collection.questions.map((question) => ({
              ...stripForCloneOrImport(question),
              creatorId: question.creatorId ?? question.userId,
              userId,
            })),
          },
        },
      })
    })

    const collections = await Promise.all(collectionsPromises)

    return this.prismaService.tag.create({
      include: {
        collections: {
          include: {
            questions: true,
          },
        },
      },
      data: {
        ...stripForCloneOrImport(tag),
        creatorId: tag.creatorId ?? tag.userId,
        userId,
        collections: {
          connect: collections,
        },
      },
    })
  }

  public async clone(userId: string, id: string): Promise<TagWithCollections> {
    const tag = await this.prismaService.tag.findUnique({
      include: {
        collections: {
          include: {
            questions: true,
          },
        },
      },
      where: { id },
    })

    if (!tag) throw new NotFoundException('Tag not found')
    if (tag.userId !== userId) throw new ForbiddenException()

    if (tag.isPrivate) throw new ForbiddenException('Tag is private')
    if (!tag.canClone) throw new ForbiddenException('Tag cannot be cloned')

    const collectionsPromises = tag.collections.map((collection) => {
      return this.prismaService.collection.create({
        select: {
          id: true,
        },
        data: {
          ...stripForCloneOrImport(collection),
          creatorId: userId,
          userId,
          questions: {
            create: collection.questions.map((question) => ({
              ...stripForCloneOrImport(question),
              creatorId: userId,
              userId,
            })),
          },
        },
      })
    })

    const collections = await Promise.all(collectionsPromises)

    return this.prismaService.tag.create({
      include: {
        collections: {
          include: {
            questions: true,
          },
        },
      },
      data: {
        ...stripForCloneOrImport(tag),
        creatorId: userId,
        userId,
        collections: {
          connect: collections,
        },
      },
    })
  }

  public async linkCollection(
    userId: string,
    id: string,
    collectionId: string,
  ): Promise<TagWithCollections> {
    const tag = await this.prismaService.tag.findUnique({
      where: { id },
    })

    if (!tag) throw new NotFoundException('Tag not found')
    if (tag.userId !== userId) throw new ForbiddenException()

    const collection = await this.prismaService.collection.findUnique({
      where: {
        id: collectionId,
      },
    })

    if (!collection) throw new NotFoundException('Collection not found')
    if (collection.userId !== userId) throw new ForbiddenException()

    return this.prismaService.tag.update({
      where: { id: tag.id },
      include: {
        collections: {
          include: {
            questions: true,
          },
        },
      },
      data: {
        collections: {
          connect: { id: collection.id },
        },
      },
    })
  }

  public async unlinkCollection(
    userId: string,
    id: string,
    collectionId: string,
  ): Promise<TagWithCollections> {
    const tag = await this.prismaService.tag.findUnique({
      where: { id },
    })

    if (!tag) throw new NotFoundException('Tag not found')
    if (tag.userId !== userId) throw new ForbiddenException()

    const collection = await this.prismaService.collection.findUnique({
      where: {
        id: collectionId,
      },
    })

    if (!collection) throw new NotFoundException('Collection not found')
    if (collection.userId !== userId) throw new ForbiddenException()

    return this.prismaService.tag.update({
      where: { id: tag.id },
      include: {
        collections: {
          include: {
            questions: true,
          },
        },
      },
      data: {
        collections: {
          disconnect: { id: collection.id },
        },
      },
    })
  }
}

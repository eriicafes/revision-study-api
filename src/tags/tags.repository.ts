import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '~/core/services/prisma.service'

@Injectable()
export class TagsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(
    userId: string,
    createTagData: Omit<Prisma.TagCreateInput, 'user'>,
  ) {
    return this.prismaService.tag.create({
      include: {
        collections: {
          include: {
            questions: true,
          },
        },
      },
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        ...createTagData,
      },
    })
  }

  public async findAll(userId: string) {
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

  public async findById(userId: string, id: string) {
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

    if (!tag) return null
    if (tag.userId !== userId) return null

    return tag
  }

  public async update(
    userId: string,
    id: string,
    updateTagData: Omit<Prisma.TagUpdateInput, 'user'>,
  ) {
    const tag = await this.prismaService.tag.findUnique({
      where: { id },
    })

    if (!tag) return null
    if (tag.userId !== userId) return null

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

  public async remove(userId: string, id: string) {
    const tag = await this.prismaService.tag.findUnique({
      where: { id },
    })

    if (!tag) return null
    if (tag.userId !== userId) return null

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

  public async linkCollection(
    userId: string,
    id: string,
    collectionId: string,
  ) {
    const tag = await this.prismaService.tag.findUnique({
      where: { id },
    })

    if (!tag) return null
    if (tag.userId !== userId) return null

    const collection = await this.prismaService.collection.findUnique({
      where: {
        id: collectionId,
      },
    })

    if (!collection) return null
    if (collection.userId !== userId) return null

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
  ) {
    const tag = await this.prismaService.tag.findUnique({
      where: { id },
    })

    if (!tag) return null
    if (tag.userId !== userId) return null

    const collection = await this.prismaService.collection.findUnique({
      where: {
        id: collectionId,
      },
    })

    if (!collection) return null
    if (collection.userId !== userId) return null

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

import { Prisma } from '@prisma/client'
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator'

export class CreateTagDto implements Omit<Prisma.TagCreateInput, 'user'> {
  @IsNotEmpty()
  title!: string

  @IsNotEmpty()
  description!: string

  @IsBoolean()
  @IsOptional()
  isPrivate?: boolean

  @IsBoolean()
  @IsOptional()
  canImport?: boolean

  @IsBoolean()
  @IsOptional()
  canClone?: boolean
}

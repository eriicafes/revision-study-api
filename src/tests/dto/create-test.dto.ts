import { Prisma } from '@prisma/client'
import { IsNotEmpty } from 'class-validator'

export class CreateTestDto implements Omit<Prisma.TestCreateInput, 'user'> {
  @IsNotEmpty()
  title!: string

  @IsNotEmpty()
  description!: string
}

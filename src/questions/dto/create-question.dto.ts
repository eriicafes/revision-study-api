import { Prisma } from '@prisma/client'
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
} from 'class-validator'

export class CreateQuestionDto
  implements Omit<Prisma.QuestionCreateInput, 'user' | 'creator'>
{
  @IsNotEmpty()
  content!: string

  @IsNotEmpty()
  answer!: string

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(4)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  otherOptions!: string[]
}

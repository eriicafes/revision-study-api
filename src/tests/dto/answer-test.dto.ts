import { Type } from 'class-transformer'
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator'

class Answer {
  @IsNotEmpty()
  questionId!: string

  @IsNotEmpty()
  answer!: string
}

export class AnswerTestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Answer)
  answers!: Answer[]
}

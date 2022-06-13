import { IsNotEmpty } from 'class-validator'

export class LinkCollectionQuestionDto {
  @IsNotEmpty()
  questionId!: string
}

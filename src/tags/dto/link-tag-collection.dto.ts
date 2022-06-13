import { IsNotEmpty } from 'class-validator'

export class LinkTagCollectionDto {
  @IsNotEmpty()
  collectionId!: string
}

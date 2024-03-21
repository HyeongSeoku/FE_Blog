import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateCommentDto {
  @IsNumber()
  postId: number;

  @IsString()
  @Length(1, 200)
  content: string;

  @IsBoolean()
  @IsOptional()
  isAnonymous?: boolean;
}

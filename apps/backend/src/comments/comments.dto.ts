import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from "class-validator";

export class CreateCommentDto {
  @IsNumber()
  postId: string;

  @IsString()
  @Length(1, 200)
  content: string;

  @IsBoolean()
  @IsOptional()
  isAnonymous?: boolean;
}

export class CreateReplyCommentDto {
  @IsString()
  @Length(1, 200)
  content: string;

  @IsBoolean()
  @IsOptional()
  isAnonymous?: boolean;
}

export class UpdateCommentDto {
  @IsString()
  @Length(1, 200)
  content: string;
}

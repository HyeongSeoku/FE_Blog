import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNumber()
  postId: number;

  @IsString()
  content: string;

  @IsNumber()
  @IsOptional()
  parentCommentId?: number;

  @IsBoolean()
  @IsOptional()
  isAnonymous?: boolean;
}

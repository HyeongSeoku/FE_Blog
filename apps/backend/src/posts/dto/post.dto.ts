import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  body: string;

  @IsNumber()
  categoryId: number;
}

export class UpdatePostDto {
  @IsString()
  title?: string;

  @IsString()
  body?: string;

  @IsNumber()
  categoryId?: number;
}

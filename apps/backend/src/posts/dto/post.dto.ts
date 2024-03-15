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
  categoryKey?: string;
}

export class ResponsePostDto {
  postId: number;

  title: string;

  body: string;

  createdAt: Date;

  updatedAt: Date;

  user: {
    userId: number;
    username: string;
  };

  category: {
    categoryKey: string;
    categoryName: string;
  };
}

import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from "class-validator";

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  body: string;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  tagNames?: string[];
}

export class UpdatePostDto {
  @IsString()
  title?: string;

  @IsString()
  body?: string;

  @IsNumber()
  categoryKey?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  tagNames?: string[];
}

export class ResponsePostDto {
  postId: string;

  title: string;

  body: string;

  createdAt: Date;

  updatedAt: Date;

  user: {
    userId: string;
    username: string;
  };

  category: {
    categoryKey: string;
    categoryName: string;
  };
}

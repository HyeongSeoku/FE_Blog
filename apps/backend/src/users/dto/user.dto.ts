import {
  IsString,
  MinLength,
  IsNotEmpty,
  IsEmail,
  Matches,
} from 'class-validator';
import { Users } from 'src/database/entities/user.entity';

/** 유저 생성 DTO */
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  password: string;

  @IsEmail()
  email: string;
}

/** 유저 응답 DTO */
export class UserResponseDto {
  userId: string;
  username: string;

  email: string;

  createdAt: Date;

  updatedAt: Date;

  lastLogin: Date;

  isAdmin: boolean;
  password: undefined;

  constructor(user: Users) {
    this.userId = user.userId;
    this.username = user.username;
    this.email = user.email;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.lastLogin = user.lastLogin;
    this.isAdmin = user.isAdmin;
    this.password = undefined;
  }
}

/** 유저 로그인 DTO */
export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

export class ChangePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  newPassword: string;
}

export class UpdateUserDto {
  username: string;
}

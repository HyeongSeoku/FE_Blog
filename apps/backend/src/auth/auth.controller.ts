import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { Users } from 'src/database/entities/user.entity';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from 'src/users/dto/login-user.dto';
import { AuthenticatedRequest } from './auth.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: AuthenticatedRequest) {
    return this.authService.login(req);
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    return await this.usersService.findById(req.user.userId);
  }

  @UseGuards(LocalAuthGuard)
  @Delete('withdrawal')
  async deleteUser(@Request() req): Promise<void> {
    await this.usersService.delete(req.user.id);
  }
}

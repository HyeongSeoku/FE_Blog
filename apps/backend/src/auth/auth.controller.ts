import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Logger,
  Post,
  Req,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthenticatedRequest } from './auth.interface';
import { RateLimit } from 'nestjs-rate-limiter';
import { Request as ExpressRequest, Response } from 'express';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @RateLimit({ points: 10, duration: 60 })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: AuthenticatedRequest, @Res() res: Response) {
    return this.authService.login(req, res);
  }

  @Post('refresh')
  async refreshTokens(@Req() req: ExpressRequest, @Res() res: Response) {
    this.logger.log('REFRESH TEST', res);
    return this.authService.generateNewAccessToken(req, res);
  }

  @RateLimit({ points: 2, duration: 60 })
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req) {
    this.logger.log(req);
    return await this.usersService.findById(req.user.userId);
  }

  @UseGuards(LocalAuthGuard)
  @Delete('withdrawal')
  async deleteUser(@Req() req): Promise<void> {
    await this.usersService.delete(req.user.id);
  }
}

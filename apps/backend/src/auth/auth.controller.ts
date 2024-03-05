import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Req,
  Request,
  Res,
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

  @Get('csrf-token')
  async csrfToken(@Req() req: ExpressRequest, @Res() res: Response) {
    try {
      const csrfToken = req.csrfToken();
      res.cookie('XSRF-TOKEN', csrfToken, {
        httpOnly: true,
      });

      res.status(HttpStatus.OK).send('CSRF token generate success.');
    } catch (error) {
      throw new HttpException(
        'CSRF token generate fail',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @RateLimit({ points: 10, duration: 60 })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: AuthenticatedRequest, @Res() res: Response) {
    return this.authService.login(req, res);
  }

  @Post('refresh')
  async refreshTokens(@Req() req: ExpressRequest, @Res() res: Response) {
    return this.authService.generateNewAccessToken(req, res);
  }

  @RateLimit({ points: 2, duration: 60 })
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req: AuthenticatedRequest) {
    this.logger.log('ME TEST', req);
    return await this.usersService.findById(req.user.userId);
  }

  @UseGuards(LocalAuthGuard)
  @Delete('withdrawal')
  async deleteUser(@Req() req): Promise<void> {
    await this.usersService.delete(req.user.id);
  }
}

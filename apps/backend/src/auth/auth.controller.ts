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
  async login(@Request() req: AuthenticatedRequest) {
    return this.authService.login(req);
  }

  @Post('refresh')
  async refreshTokens(
    @Req() request: Request,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const authorizationHeader = request.headers['authorization'];
    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const bearerToken = authorizationHeader.split(' ')[1];
    return this.authService.generateNewAccessToken(bearerToken);
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
    // return await this.usersService.findById(req.user.userId);
  }

  @UseGuards(LocalAuthGuard)
  @Delete('withdrawal')
  async deleteUser(@Req() req): Promise<void> {
    await this.usersService.delete(req.user.id);
  }
}

import { Injectable, Logger, Req, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/database/entities/user.entity';
import { AuthenticatedRequest } from './auth.interface';
import { UserResponseDto } from 'src/users/dto/user.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async generateToken(user: Users): Promise<string> {
    const payload = { username: user.username, sub: user.userId };
    return this.jwtService.sign(payload);
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.findOne(email);

    if (user && bcrypt.compareSync(password, user.password)) {
      return new UserResponseDto(user);
    }
    return null;
  }

  async login(@Req() req: AuthenticatedRequest) {
    if ('userId' in req.user) {
      const access_token = await this.generateToken(req.user);
      return { access_token };
    }

    throw new UnauthorizedException();
  }
}

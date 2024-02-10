import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/database/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async generateToken(user: Users): Promise<string> {
    const payload = { username: user.username, sub: user.userId };
    return this.jwtService.sign(payload);
  }

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOne(username);

    if (user && bcrypt.compareSync(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: Users) {
    const access_token = this.generateToken(user);
    return { access_token };
  }
}

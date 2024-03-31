import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('info/:username')
  async getUserInfo(@Param('username') username: string) {
    return this.usersService.userInfo(username);
  }
}

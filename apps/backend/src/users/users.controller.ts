import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get("info/:username")
  async getUserInfo(@Param("username") username: string) {
    if (!username) throw new BadRequestException("username is required");
    const targetUserData = await this.usersService.userInfo(username);

    if (!targetUserData) throw new NotFoundException("User does not exist");

    return targetUserData;
  }
}

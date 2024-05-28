import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "../guards/local-auth.guard";
import {
  ChangePasswordDto,
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from "src/users/dto/user.dto";
import {
  REFRESH_TOKEN_KEY,
  ACCESS_TOKEN_KEY,
  GITHUB_OAUTH_KEY,
} from "src/constants/cookie.constants";
import { UsersService } from "src/users/users.service";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { AuthenticatedRequest } from "./auth.interface";
import { RateLimit } from "nestjs-rate-limiter";
import { Request as ExpressRequest, Request, Response } from "express";
import {
  ACCESS_TOKEN_EXPIRE_TIME,
  REFRESH_TOKEN_EXPIRE_TIME,
} from "src/constants/auth.constants";
import { Users } from "src/database/entities/user.entity";
import { RefreshTokenService } from "src/refresh-token/refresh-token.service";
import { GithubAuthGuard } from "src/guards/github-auth.guard";
import { v4 as uuidv4 } from "uuid";
import { clearCookie, setCookie } from "src/utils/cookie";
import { FindOrCreateUserByGithubResponse } from "src/users/users.service.interface";

@Controller("auth")
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  private omitPassword(user: UserResponseDto): Partial<Users> {
    const { password, ...result } = user;
    return result;
  }

  constructor(
    private authService: AuthService,
    private readonly usersService: UsersService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  @RateLimit({ points: 10, duration: 60 })
  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    const { user } = req;

    const loginResult = await this.authService.login(user);
    if (!loginResult) throw new UnauthorizedException("Login failed");

    const { accessToken, lastLogin, refreshToken } = loginResult;

    const refreshTokenExpires = new Date();
    refreshTokenExpires.setDate(
      refreshTokenExpires.getDate() + REFRESH_TOKEN_EXPIRE_TIME,
    );

    setCookie(res, REFRESH_TOKEN_KEY, refreshToken, {
      expires: refreshTokenExpires,
    });

    return res.status(200).json({ accessToken, lastLogin });
  }

  @UseGuards(JwtAuthGuard)
  @Post("logout")
  async logout(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    const userId = req?.user?.userId;
    if (!userId)
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "User not authenticated" });

    const result = await this.authService.logout(userId);

    if (result) {
      setCookie(res, REFRESH_TOKEN_KEY, "", { expires: new Date(0) });

      return res
        .status(HttpStatus.OK)
        .json({ message: "Logged out successfully" });
    } else {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Logged out failed" });
    }
  }

  @Post("refresh")
  async refreshTokens(@Req() req: ExpressRequest, @Res() res: Response) {
    const refreshToken = req.cookies[REFRESH_TOKEN_KEY];
    if (!refreshToken) throw new NotFoundException("refreshToken is not exist");

    const generateResult =
      await this.authService.generateNewAccessTokenByRefreshToken(refreshToken);

    if (!generateResult)
      throw new UnauthorizedException("Invalid refreshToken");

    const { newAccessToken, newRefreshToken } = generateResult;

    const refreshTokenExpires = new Date().setDate(
      new Date().getDate() + REFRESH_TOKEN_EXPIRE_TIME,
    );

    setCookie(res, REFRESH_TOKEN_KEY, newRefreshToken, {
      expires: new Date(refreshTokenExpires),
    });

    return res.status(200).json({ accessToken: newAccessToken });
  }

  @RateLimit({ points: 2, duration: 60 })
  @Post("signup")
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(createUserDto);
    return { user: this.omitPassword(user) };
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  async getProfile(
    @Req() request: AuthenticatedRequest,
    @Res() response: Response,
  ) {
    const user = request.user;

    if (user.error) {
      // 오류가 있는 경우 적절한 응답 반환
      return response.status(200).json({ message: user.error });
    }

    const { userId } = user;
    const userData = await this.usersService.findById(userId);

    if (!userData) {
      // throw new UnauthorizedException(`${userId} is not a valid user`);
      return response
        .status(200)
        .json({ message: `${userId} is not a valid user` });
    }

    if (request.newTokens) {
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        request.newTokens;

      // 토큰 쿠키에 재 저장
      const accessTokenExpires = new Date();
      accessTokenExpires.setMinutes(
        accessTokenExpires.getMinutes() + ACCESS_TOKEN_EXPIRE_TIME,
      );

      setCookie(response, ACCESS_TOKEN_KEY, newAccessToken, {
        expires: accessTokenExpires,
      });

      const refreshTokenExpires = new Date();
      refreshTokenExpires.setDate(
        refreshTokenExpires.getDate() + REFRESH_TOKEN_EXPIRE_TIME,
      );

      setCookie(response, REFRESH_TOKEN_KEY, newRefreshToken, {
        expires: refreshTokenExpires,
      });

      this.logger.log(
        "TEST ME",
        request.newTokens.accessToken,
        request.newTokens.refreshToken,
      );
    }

    // 응답 헤더 확인
    console.log(
      "ME RESPONSE Headers : ",
      JSON.stringify(response.getHeaders()),
    );

    const { password, ...result } = userData;
    return response.status(200).json(result);
  }

  //FIXME: 유효하지 않은 유저에 대해 LocalAuthGuard 내에서 에러 로그 및 반환값 처리 필요
  @UseGuards(LocalAuthGuard)
  @Delete("withdrawal")
  async deleteUser(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ): Promise<void> {
    const userId = req.user?.userId;
    await this.usersService.deleteUser(userId);
    res.status(HttpStatus.OK).json({ message: "delete user success" });
  }

  @UseGuards(JwtAuthGuard)
  @Post("change-password")
  async changePassword(
    @Req() req: AuthenticatedRequest,
    @Body() changePasswordDto: ChangePasswordDto,
    @Res() res: Response,
  ): Promise<void> {
    const userId = req.user.userId;
    const refreshToken = req.cookies[REFRESH_TOKEN_KEY];

    await this.usersService.changePassword(userId, changePasswordDto);

    await this.refreshTokenService.deleteToken(refreshToken);

    res
      .status(HttpStatus.OK)
      .json({ message: "Password successfully changed", accessToken: "" });
  }

  @UseGuards(JwtAuthGuard)
  @Patch("update")
  async updateUser(
    @Req() req: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update(req?.user.userId, updateUserDto);
  }

  @Get("github/login")
  //NOTE: { passthrough: true }옵션 없으면 무한 로딩 걸릴 수 있음
  async githubAuthLogin(@Res({ passthrough: true }) res: Response) {
    const oauth_state = uuidv4();
    setCookie(res, GITHUB_OAUTH_KEY, oauth_state);

    const githubOauthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${process.env.BE_BASE_URL}/auth/github/callback`)}&scope=user:email&state=${oauth_state}`;
    return { url: githubOauthUrl };
  }

  @UseGuards(GithubAuthGuard)
  @Get("github/callback")
  async githubAuthRedirect(
    @Req() req: Request,
    @Res() res: Response,
    @Query("state") queryState: string,
  ) {
    const oauthCookieState = req.cookies[GITHUB_OAUTH_KEY];

    if (queryState !== oauthCookieState) {
      clearCookie(res, GITHUB_OAUTH_KEY);

      //FIXME: 프론트로 redirect되진 않음
      throw new HttpException(
        "유효하지 않은 요청이 감지되었습니다.",
        HttpStatus.FORBIDDEN,
      );
    }

    clearCookie(res, GITHUB_OAUTH_KEY);
    const githubData = req.user as FindOrCreateUserByGithubResponse;

    if (!githubData.user) {
      // res.redirect("/login");
    } else {
      const { accessToken, refreshToken } = await this.authService.githubLogin(
        githubData.user,
      );

      if (!accessToken) {
        res.redirect(`${process.env.FE_BASE_URL}/login?error=badRequest`);
      }

      const accessTokenExpires = new Date();
      accessTokenExpires.setMinutes(
        accessTokenExpires.getMinutes() + ACCESS_TOKEN_EXPIRE_TIME,
      );

      setCookie(res, ACCESS_TOKEN_KEY, accessToken, {
        expires: accessTokenExpires,
      });

      const refreshTokenExpires = new Date();
      refreshTokenExpires.setDate(
        refreshTokenExpires.getDate() + REFRESH_TOKEN_EXPIRE_TIME,
      );

      this.logger.log("GITHUB LOGIN REFRESH_TOKEN", refreshToken);

      setCookie(res, REFRESH_TOKEN_KEY, refreshToken, {
        expires: refreshTokenExpires,
      });

      res.redirect(`${process.env.FE_BASE_URL}/login/success`);
    }
  }
}

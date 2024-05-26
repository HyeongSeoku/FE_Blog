import { Response } from "express";
import { isProdMode } from "./env";
import { Logger } from "@nestjs/common";
const logger = new Logger("setCookie");

interface CookieOptions {
  httpOnly?: boolean;
  expires?: Date;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  path?: string;
}

export const clearCookie = (response: Response, cookieName: string) => {
  response.cookie(cookieName, "", {
    httpOnly: true,
    secure: isProdMode,
    sameSite: isProdMode ? "strict" : "lax",
    expires: new Date(0),
  });
};

export const deleteCookie = (res: Response, key: string): void => {
  res.cookie(key, "", {
    expires: new Date(0),
    httpOnly: true,
  });
};

export const setCookie = (
  res: Response,
  key: string,
  value: string,
  options: CookieOptions = {},
): void => {
  const {
    httpOnly = true,
    expires,
    secure = isProdMode,
    sameSite = isProdMode ? "strict" : "lax",
    path = "/",
  } = options;
  logger.log(
    `Setting cookie: ${key} = ${value}`,
    `secure:${secure}`,
    `sameSite:${sameSite}`,
  );

  deleteCookie(res, key);

  res.cookie(key, value, {
    httpOnly,
    expires,
    secure,
    sameSite,
    path,
  });
};

export const parseCookies = (cookieHeader: string) => {
  const cookies = {};
  if (cookieHeader) {
    cookieHeader.split(";").forEach((cookie) => {
      const [key, value] = cookie.split("=").map((c) => c.trim());
      cookies[key] = decodeURIComponent(value);
    });
  }
  return cookies;
};

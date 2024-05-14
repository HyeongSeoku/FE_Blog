import { Response } from "express";
import { isProdMode } from "./env";

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

  res.cookie(key, value, {
    httpOnly,
    expires,
    secure,
    sameSite,
    path,
  });
};

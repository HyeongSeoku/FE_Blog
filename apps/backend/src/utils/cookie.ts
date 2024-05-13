import { Response } from "express";
import { isProdMode } from "./env";

export const clearCookie = (response: Response, cookieName: string) => {
  response.cookie(cookieName, "", {
    httpOnly: true,
    secure: isProdMode,
    sameSite: isProdMode ? "strict" : "lax",
    expires: new Date(0),
  });
};

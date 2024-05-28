export const parseCookies = (cookieHeader: string) => {
  const cookies: Record<string, string> = {};
  if (cookieHeader) {
    cookieHeader.split(";").forEach((cookie) => {
      const [key, value] = cookie.split("=").map((c) => c.trim());
      cookies[key] = decodeURIComponent(value);
    });
  }
  return cookies;
};

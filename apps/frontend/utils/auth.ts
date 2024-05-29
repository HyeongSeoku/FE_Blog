import { getUserProfile } from "server/user";
import { redirect } from "@remix-run/node";
import { isLoginRequired } from "./route";

// export const isLoginRequired = (pathname: string) => {
//   const protectRoutes = ["/write", "/setting", "/login/success"];
//   return protectRoutes.some((route) => pathname.startsWith(route));
// };

export const ssrRequestUser = async (request: Request) => {
  const cookieHeader = request.headers.get("Cookie");

  const {
    data: user,
    error,
    setCookieHeaders,
  } = await getUserProfile(
    { headers: { cookies: cookieHeader || "" } },
    request,
  );

  if (!user || error) {
    throw redirect("/login");
  }
  return { user, setCookieHeaders };
};

export async function loaderCheckUser(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  let user = null;
  const headers = new Headers();

  if (isLoginRequired(pathname)) {
    const { user: userData, setCookieHeaders } = await ssrRequestUser(request);
    user = userData;

    if (setCookieHeaders) {
      setCookieHeaders.forEach((cookie) => {
        headers.append("Set-Cookie", cookie);
      });
    }
  }

  return { user, headers };
}

import { getUserProfile } from "server/user";
import { redirect } from "@remix-run/node";
import { isLoginRequired } from "./route";

export const ssrRequestUser = async (
  request: Request,
  isAdminPage: boolean,
) => {
  const { data: user, error, setCookieHeaders } = await getUserProfile(request);

  if (!user || error) {
    throw redirect("/login?failStatus=400");
  }

  if (isAdminPage) {
    if (!user?.isAdmin) {
      throw redirect("/login?failStatus=403");
    }
  }
  return { user, setCookieHeaders };
};

export async function loaderCheckUser(
  request: Request,
  isAdminPage: boolean = false,
) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  let user = null;
  const headers = new Headers();

  if (isLoginRequired(pathname)) {
    const { user: userData, setCookieHeaders } = await ssrRequestUser(
      request,
      isAdminPage,
    );
    user = userData;

    if (setCookieHeaders) {
      setCookieHeaders.forEach((cookie) => {
        headers.append("Set-Cookie", cookie);
      });
    }
  }

  return { user, headers };
}

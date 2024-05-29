import { getUserProfile } from "server/user";
import { redirect } from "@remix-run/node";

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

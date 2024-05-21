import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { ACCESS_TOKEN_KEY } from "constants/cookie.constants";
import { parse } from "cookie";

interface LoaderData {
  accessToken: string;
  userProfile: any;
}

export const meta: MetaFunction = () => {
  return [
    { title: "login success" },
    { name: "login success", content: "login success" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request?.headers.get("Cookie");
  const cookies = parse(cookieHeader || "");

  const accessToken = cookies[ACCESS_TOKEN_KEY];

  if (!accessToken) {
    throw new Response("Token is required", { status: 401 });
  }
  return { accessToken };
};

export default function GithubLoginSuccessPage() {
  return (
    <div>
      <h2>로그인 성공 페이지</h2>
      <Link to="/">홈으로</Link>
    </div>
  );
}

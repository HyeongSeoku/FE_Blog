import { LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getUserProfile } from "server/user";

interface LoaderData {
  token: string;
  userProfile: any;
}

export const meta: MetaFunction = () => {
  return [
    { title: "login success" },
    { name: "login success", content: "login success" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    throw new Response("Token is required", { status: 401 });
  }
  try {
    const { data: userProfile, error } = await getUserProfile(token);

    if (error !== null) {
      throw redirect("/");
    }

    return { token, userProfile };
  } catch (error) {
    throw redirect("/");
  }
};

export default function GithubLoginSuccessPage() {
  const { token, userProfile } = useLoaderData<LoaderData>();

  return (
    <div>
      <h2>로그인 성공 페이지</h2>
      <div>{token}</div>
      <div>{userProfile?.username}</div>
      <Link to="/">홈으로</Link>
    </div>
  );
}

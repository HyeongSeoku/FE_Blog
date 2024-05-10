import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getUserProfile } from "server/user";

// 정의된 데이터 타입
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
    const userProfile = await getUserProfile(token);

    return { token, userProfile };
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    throw new Response("Failed to fetch user profile", { status: 500 });
  }
};

export default function GithubLoginSuccessPage() {
  const { token, userProfile } = useLoaderData<LoaderData>(); // 로더 함수에서 반환된 데이터 사용

  return (
    <div>
      <h2>로그인 성공 페이지</h2>
      <div>{token}</div>
      <div>{userProfile.username}</div>
      <Link to="/">홈으로</Link>
    </div>
  );
}

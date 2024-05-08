import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { getUserProfile } from "server/user";
import { c } from "vite/dist/node/types.d-aGj9QkWt";

// 정의된 데이터 타입
interface LoaderData {
  token: string;
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

  // if (!token) {
  //   throw new Response("Token is required", { status: 401 });
  // }
  // try {
  //   const userProfile = await getUserProfile(token);
  //   console.log("TEST", token, userProfile);

  //   return { token, userProfile }; // 가져온 데이터 반환
  // } catch (error) {
  //   console.error("Failed to fetch user profile:", error);
  //   throw new Response("Failed to fetch user profile", { status: 500 });
  // }
  return { token };
};

export default function GithubLoginSuccessPage() {
  const { token } = useLoaderData<LoaderData>(); // 로더 함수에서 반환된 데이터 사용

  useEffect(() => {
    const data = getUserProfile(token);
    console.log("TEST DATA", data);
  }, []);

  return (
    <div>
      <h2>로그인 성공 페이지</h2>
      <div>{token}</div>
      <Link to="/">홈으로</Link>
    </div>
  );
}

import { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import useUserStore from "store/user";

export const meta: MetaFunction = () => {
  return [
    { title: "login success" },
    { name: "login success", content: "login success" },
  ];
};

export default function GithubLoginSuccessPage() {
  const { userStore } = useUserStore();

  return (
    <div>
      <h2>로그인 성공 페이지</h2>
      <div>{userStore.username}</div>
      <Link to="/">홈으로</Link>
    </div>
  );
}

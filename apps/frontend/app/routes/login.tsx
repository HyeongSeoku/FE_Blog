import { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "login" }, { name: "login", content: "login" }];
};

export default function Index() {
  return (
    <div>
      <h2>로그인 페이지</h2>
      <div>
        <button>github으로 로그인</button>
      </div>
      <Link to="/">홈으로</Link>
    </div>
  );
}

import { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { githubLogin } from "../../server/user";

export const meta: MetaFunction = () => {
  return [{ title: "login" }, { name: "login", content: "login" }];
};

export default function Index() {
  const handleGithubLogin = async () => {
    const response = await githubLogin();

    console.log("TEST", response);
  };

  return (
    <div>
      <h2>로그인 페이지</h2>
      <div>
        <button onClick={handleGithubLogin}>github으로 로그인</button>
      </div>
      <Link to="/">홈으로</Link>
    </div>
  );
}

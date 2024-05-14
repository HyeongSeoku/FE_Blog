import { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { getGithubAuthUrl } from "server/user";
export const meta: MetaFunction = () => {
  return [{ title: "login" }, { name: "login", content: "login" }];
};

export default function LoginPage() {
  const handleGithubLogin = async () => {
    const { data, error } = await getGithubAuthUrl();
    if (!data?.url || error) {
      // FIXME: 임시 오류 처리
      alert("오류 발생");
      return;
    }

    window.location.href = data.url;
  };

  return (
    <div>
      <h2>로그인 페이지</h2>
      <div>
        <button onClick={handleGithubLogin}>github으로 로그인</button>
      </div>
      <Link to="/">홈으로</Link>
      <Link to="/github-login/success">성공 페이지로</Link>
    </div>
  );
}

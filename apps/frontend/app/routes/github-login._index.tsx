import { MetaFunction } from "@remix-run/node";
import { Link, useNavigate } from "@remix-run/react";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export const meta: MetaFunction = () => {
  return [{ title: "login" }, { name: "login", content: "login" }];
};

export default function GithubLoginPage() {
  const [state, setState] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // state 값을 생성하여 상태에 저장
    const newState = uuidv4();
    setState(newState);
    localStorage.setItem("oauth_state", newState);
  }, []);

  const handleGithubLogin = async () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${import.meta.env.VITE_SERVER_API_BASE_URL}/auth/github/callback`)}&scope=user:email&state=${state}`;
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

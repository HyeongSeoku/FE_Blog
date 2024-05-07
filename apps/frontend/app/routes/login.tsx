import { MetaFunction } from "@remix-run/node";
import { Link, useNavigate } from "@remix-run/react";
import { githubLogin } from "../../server/user";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const meta: MetaFunction = () => {
  return [{ title: "login" }, { name: "login", content: "login" }];
};

export default function Index() {
  const [state, setState] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // state 값을 생성하여 상태에 저장
    const newState = uuidv4();
    setState(newState);
    localStorage.setItem("oauth_state", newState);
  }, []);

  const handleGithubLogin = async () => {
    // const response = await githubLogin(state);
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${import.meta.env.VITE_API_BASE_URL}/auth/github/callback`)}&scope=user:email&state=${state}`;
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

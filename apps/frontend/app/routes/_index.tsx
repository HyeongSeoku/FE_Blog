import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <div>HOME</div>
      <Link to="/login">login 페이지 이동</Link>
      <Link to="/write" className="text-blue-500 hover:text-blue-700">
        글 작성하기 페이지 이동
      </Link>
    </div>
  );
}

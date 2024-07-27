import { Link } from "@remix-run/react";
import NoneLayout from "~/layout/noneLayout";
import { Handle } from "~/types/handle";
import styles from "../styles/tailwind.css?url";
import { LinksFunction } from "@remix-run/node";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function NotFound() {
  return (
    <div>
      <h1>페이지를 찾을 수 없습니다.</h1>
      <Link to="/">Go back to the homepage</Link>
    </div>
  );
}
export const handle: Handle = {
  metaTitle: "Not Found",
  Layout: NoneLayout,
};

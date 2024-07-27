import NotFound from "./404";

export function loader() {
  throw new Response("Not Found", {
    status: 404,
  });
}

export default function Fallback() {
  return <NotFound />;
}

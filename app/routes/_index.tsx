import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { PostProps } from "~/types/posts";

import PostCard from "~/components/PostCard";

export const loader: LoaderFunction = async ({ request }) => {
  return {};
};

const Index = () => {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <div>HOME</div>

      <h2>게시물</h2>
      <ul></ul>
    </div>
  );
};

export default Index;

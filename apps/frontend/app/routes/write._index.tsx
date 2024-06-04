import { LoaderFunction, MetaFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import useUserStore from "store/user";
import { loaderCheckUser } from "utils/auth";
import useSyncUserStore from "~/hooks/useSyncUserStore";
import { Handle } from "~/types/handle";
import { AuthLoaderData } from "~/types/shared";

export const meta: MetaFunction = () => {
  return [
    { charset: "utf-8" },
    { title: "글 작성 페이지" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
  ];
};

export const handle: Handle = {
  headerType: "BACK",
};

export const loader: LoaderFunction = async ({ request }) => {
  const { user, headers } = await loaderCheckUser(request, true);

  return json(
    {
      user,
    },
    { headers },
  );
};

export default function Write() {
  const [markdown, setMarkdown] = useState("");
  const { user } = useLoaderData<AuthLoaderData>();
  const { userStore } = useUserStore();

  const contentEditableRef = useRef<HTMLDivElement>(null);

  useSyncUserStore(user);

  const handleChange = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLDivElement;
    setMarkdown(target.innerText);
  };

  return (
    <div className="container">
      <div>{userStore.username}</div>
      <div>{userStore.isAdmin}</div>
      <h1 className="text-3xl font-bold mb-4">글 작성</h1>
      <div className="flex flex-col md:flex-row">
        <div
          ref={contentEditableRef}
          contentEditable
          className="w-full h-96 p-2 border border-gray-300 rounded overflow-y-auto"
          onInput={handleChange}
        ></div>
        <div className="w-full h-96 p-2 border border-gray-300 rounded overflow-y-auto">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

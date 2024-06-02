import { LoaderFunction, json } from "@remix-run/node";
import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import useUserStore from "store/user";
import { loaderCheckUser } from "utils/auth";

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
  const { userStore } = useUserStore();
  const contentEditableRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLDivElement;
    setMarkdown(target.innerText);
  };

  return (
    <div className="container mx-auto p-4">
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

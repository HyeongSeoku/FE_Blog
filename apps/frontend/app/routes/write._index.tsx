import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

export default function Write() {
  const [markdown, setMarkdown] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log("TESTSETSETSET", e.target.value);
    setMarkdown(e.target.value);
  };

  console.log("TEST WRITE");

  useEffect(() => {
    console.log("TEST CHANGE", markdown);
  }, [markdown]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">글 작성</h1>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 p-2">
          <textarea
            className="w-full h-96 p-2 border border-gray-300 rounded"
            placeholder="Markdown으로 글을 작성하세요..."
            value={markdown}
            onChange={handleChange}
          />
        </div>
        <div className="w-full md:w-1/2 p-2">
          <div className="prose prose-lg p-4 border border-gray-300 rounded h-96 overflow-y-auto">
            <ReactMarkdown
              children={markdown}
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

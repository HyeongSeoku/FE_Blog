"use client";

// components/CodeBlock.tsx
import { ReactNode, useState, useMemo } from "react";

interface CodeBlockProps {
  children: ReactNode;
}

const CodeBlock = ({ children }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const extractTextFromChildren = (node: ReactNode): string => {
    if (typeof node === "string") {
      return node;
    }

    if (Array.isArray(node)) {
      return node.map(extractTextFromChildren).join("");
    }

    if (typeof node === "object" && node && "props" in node) {
      const { children } = node.props;
      return extractTextFromChildren(children);
    }

    return "";
  };

  const codeText = useMemo(() => {
    return extractTextFromChildren(children);
  }, [children]);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative group">
      <pre className="p-2 bg-gray-900 rounded-md text-white overflow-x-auto">
        <code>{children}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1 bg-gray-700 text-white rounded opacity-0 group-hover:opacity-100 flex items-center justify-center w-16 h-8 transition-opacity duration-200"
      >
        <span
          className={`transition-opacity duration-300 ${copied ? "opacity-100" : "opacity-0"} absolute`}
        >
          Copied
        </span>
        <span
          className={`transition-opacity duration-300 ${copied ? "opacity-0" : "opacity-100"} absolute`}
        >
          Copy
        </span>
      </button>
    </div>
  );
};

export default CodeBlock;

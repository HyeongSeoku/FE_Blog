import parse, { domToReact } from "html-react-parser";
import CodeBlock from "@/components/CodeBlock";
import MdxLink from "@/components/MdxLink";

export function ParsePostContent({ html }: { html: string }) {
  return (
    <article className="markdown-contents">
      {parse(html, {
        replace: (domNode: any) => {
          if (domNode.attribs?.["data-custom-code"]) {
            return <CodeBlock>{domToReact(domNode.children)}</CodeBlock>;
          }
          if (domNode.attribs?.["data-custom-link"]) {
            return (
              <MdxLink href={domNode.attribs.href}>
                {domToReact(domNode.children)}
              </MdxLink>
            );
          }
        },
      })}
    </article>
  );
}

import parse, { type DOMNode, domToReact, Element } from "html-react-parser";
import CodeBlock from "@/components/CodeBlock";
import MdxLink from "@/components/MdxLink";

export function ParsePostContent({ html }: { html: string }) {
  return (
    <article className="markdown-contents">
      {parse(html, {
        replace: (domNode: DOMNode) => {
          if (!(domNode instanceof Element)) return;
          if (domNode.attribs?.["data-custom-code"]) {
            return (
              <CodeBlock>{domToReact(domNode.children as DOMNode[])}</CodeBlock>
            );
          }
          if (domNode.attribs?.["data-custom-link"]) {
            return (
              <MdxLink href={domNode.attribs.href}>
                {domToReact(domNode.children as DOMNode[])}
              </MdxLink>
            );
          }
        },
      })}
    </article>
  );
}

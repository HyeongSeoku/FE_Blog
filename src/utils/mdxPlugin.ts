import { visit } from "unist-util-visit";
import { ExtendedElement, HeadingsProps } from "@/types/mdx";

export const rehypeHeadingsWithIds = (headingData: HeadingsProps[]) => {
  return () => (tree: any) => {
    visit(tree, "element", (node) => {
      const elementNode = node as ExtendedElement;
      if (["h2", "h3"].includes(elementNode.tagName || "")) {
        const heading = headingData.find(
          (h) => h.text === elementNode.children[0]?.value,
        );
        if (heading) {
          heading.isVisit = true;
          elementNode.properties = {
            ...elementNode.properties,
            id: heading.id,
          };
        }
      }
    });
  };
};

export const rehypeCodeBlockClassifier = () => {
  return () => (tree: any) => {
    visit(tree, "element", (node, index, parent) => {
      const elementNode = node as ExtendedElement;
      if (elementNode.tagName === "code") {
        const isBlockCode = parent?.tagName === "pre";
        node.properties = {
          ...(node.properties || {}),
          className: [
            ...(node.properties.className || []),
            isBlockCode ? "block-code" : "inline-code",
          ],
        };
      }
    });
  };
};

import { visit } from "unist-util-visit";
import type { Plugin } from "unified";
import type { ExtendedElement, HeadingsProps } from "@/types/mdx";

type ElementNode = {
  type: "element";
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: any[];
};

export const rehypeHeadingsWithIds: Plugin<[HeadingsProps[]]> = (
  headingData,
) => {
  return (tree) => {
    if (!tree || typeof tree !== "object" || !("type" in tree)) {
      return;
    }

    visit(tree, "element", (node) => {
      const elementNode = node as ElementNode;

      if (["h2", "h3"].includes(elementNode.tagName || "")) {
        if (Array.isArray(elementNode.children)) {
          for (const item of elementNode.children) {
            if (item.type === "text" && item.value) {
              const headingLevel = elementNode.tagName === "h2" ? 2 : 3;
              const heading = headingData.find(
                (h) =>
                  h.text === item.value &&
                  !h.isVisit &&
                  h.level === headingLevel,
              );

              if (heading) {
                heading.isVisit = true;
                elementNode.properties = elementNode.properties || {};
                (elementNode.properties as any).id = heading.id;
              }
            }
          }
        }
      }
    });
  };
};

export const rehypeCodeBlockClassifier = () => {
  return (tree: any) => {
    visit(tree, "element", (node, _, parent) => {
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

import { visit } from "unist-util-visit";
import type { Plugin } from "unified";
import type { HeadingsProps } from "@/types/mdx";
import {
  MARKUP_ANIMATE,
  MARKUP_BEFORE_ANIMATE,
} from "@/constants/animation.constants";

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
      if (node.tagName === "code") {
        const isBlockCode = parent?.tagName === "pre";
        node.properties = node.properties || {};

        const cls = node.properties.className || [];
        const normalized = Array.isArray(cls) ? cls : [cls];

        node.properties.className = [
          ...normalized,
          isBlockCode ? "block-code" : "inline-code",
        ];
      }
    });
  };
};

export const rehypeAnimateFadeInUp: Plugin<[]> = () => {
  return (tree) => {
    visit(tree, "element", (node: Element) => {
      const el = node as Element & { properties: Record<string, any> };
      el.properties = el.properties || {};

      const cls = (el.properties.className || []) as string[] | string;
      const normalized = Array.isArray(cls) ? cls : [cls];

      if (!normalized.includes(MARKUP_ANIMATE)) {
        el.properties.className = [
          ...normalized,
          MARKUP_ANIMATE,
          MARKUP_BEFORE_ANIMATE,
        ];
      }
    });
  };
};

export const rehypeMarkCustomElements = () => {
  return (tree: any) => {
    visit(tree, "element", (node: any, index, parent) => {
      if (node.tagName === "code") {
        const isInlineCode = parent?.tagName !== "pre";
        node.properties = node.properties || {};

        if (!isInlineCode) {
          node.properties["data-custom-code"] = "true";
        }
      }
      if (node.tagName === "a") {
        node.properties = node.properties || {};
        node.properties["data-custom-link"] = "true";
      }
    });
  };
};

import { visit } from "unist-util-visit";
import type { Plugin } from "unified";
import type { ExtendedElement, HeadingsProps } from "@/types/mdx";
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

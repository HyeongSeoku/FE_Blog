import type { Plugin } from "unified";
import type { Node } from "unist";
import { visit } from "unist-util-visit";
import {
  MARKUP_ANIMATE,
  MARKUP_BEFORE_ANIMATE,
} from "@/constants/animation.constants";
import type { HeadingsProps } from "@/types/mdx";

interface HastNode extends Node {
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
  value?: string;
}

export const rehypeHeadingsWithIds: Plugin<[HeadingsProps[]]> = (
  headingData,
) => {
  return (tree) => {
    if (!tree || typeof tree !== "object" || !("type" in tree)) {
      return;
    }

    visit(tree as HastNode, "element", (node: HastNode) => {
      if (["h2", "h3"].includes(node.tagName || "")) {
        if (Array.isArray(node.children)) {
          for (const item of node.children) {
            if (item.type === "text" && item.value) {
              const headingLevel = node.tagName === "h2" ? 2 : 3;
              const heading = headingData.find(
                (h) =>
                  h.text === item.value &&
                  !h.isVisit &&
                  h.level === headingLevel,
              );

              if (heading) {
                heading.isVisit = true;
                node.properties = node.properties ?? {};
                node.properties.id = heading.id;
              }
            }
          }
        }
      }
    });
  };
};

export const rehypeCodeBlockClassifier = () => {
  return (tree: HastNode) => {
    visit(
      tree,
      "element",
      (node: HastNode, _, parent: HastNode | undefined) => {
        if (node.tagName === "code") {
          const isBlockCode = parent?.tagName === "pre";
          node.properties = node.properties ?? {};

          const cls = node.properties.className ?? [];
          const normalized = Array.isArray(cls) ? cls : [cls];

          node.properties.className = [
            ...(normalized as string[]),
            isBlockCode ? "block-code" : "inline-code",
          ];
        }
      },
    );
  };
};

export const rehypeAnimateFadeInUp: Plugin<[]> = () => {
  return (tree) => {
    visit(tree as HastNode, "element", (node: HastNode) => {
      node.properties = node.properties ?? {};

      const cls = (node.properties.className ?? []) as string[] | string;
      const normalized = Array.isArray(cls) ? cls : [cls];

      if (!normalized.includes(MARKUP_ANIMATE)) {
        node.properties.className = [
          ...normalized,
          MARKUP_ANIMATE,
          MARKUP_BEFORE_ANIMATE,
        ];
      }
    });
  };
};

export const rehypeMarkCustomElements = () => {
  return (tree: HastNode) => {
    visit(
      tree,
      "element",
      (node: HastNode, _index, parent: HastNode | undefined) => {
        if (node.tagName === "code") {
          const isInlineCode = parent?.tagName !== "pre";
          node.properties = node.properties ?? {};

          if (!isInlineCode) {
            node.properties["data-custom-code"] = "true";
          }
        }
        if (node.tagName === "a") {
          node.properties = node.properties ?? {};
          node.properties["data-custom-link"] = "true";
        }
      },
    );
  };
};

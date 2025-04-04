import { visit } from "unist-util-visit";
import { ExtendedElement, HeadingItems, HeadingsProps } from "@/types/mdx";

export const rehypeHeadingsWithIds = (headingData: HeadingsProps[]) => {
  return (tree: any) => {
    // 노드를 탐색하며 조작
    visit(tree, "element", (node) => {
      // 노드 조작 로직
      const elementNode = node as ExtendedElement;

      if (["h2", "h3"].includes(elementNode.tagName || "")) {
        for (const item of elementNode.children) {
          const headingItem = item as HeadingItems;
          if (headingItem.value && headingItem.type === "text") {
            const headingLevel = elementNode.tagName === "h2" ? 2 : 3;
            const heading = headingData.find(
              (h) =>
                h.text === headingItem.value &&
                !h.isVisit &&
                h.level === headingLevel,
            );

            if (heading) {
              heading.isVisit = true;
            }

            // 헤딩이 존재하면 id 속성 추가
            if (heading) {
              elementNode.properties = elementNode.properties || {};
              elementNode.properties.id = heading.id;
            }
          }
        }
      }
    });

    return tree;
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

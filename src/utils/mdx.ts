import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import { FrontMatterProps, getMdxContentsResponse } from "@/types/mdx";
import { Options } from "rehype-pretty-code";
import fs from "fs/promises";

// export const getMdxContents = async (
//   slug: string[],
//   fileDirectory: string,
//   rehypePlugins?: any[],
// ): Promise<getMdxContentsResponse | null> => {
//   const filePath = `${fileDirectory}/${slug.join("/")}.mdx`;

//   try {
//     const source = await fs.readFile(filePath, "utf8");
//     const { content, data } = matter(source);
//     const frontMatter = data as FrontMatterProps;

//     const rehypePrettyCodeOptions: Options = {
//       theme: "github-dark",
//       onVisitLine(node: any) {
//         if (node.children && node.children.length === 0) {
//           node.children = [{ type: "text", value: " " }];
//         }
//       },
//     };

//     const mdxSource = await serialize(content, {
//       mdxOptions: {
//         rehypePlugins: [...rehypePlugins, [rehypePrettyCodeOptions]],
//       },
//       scope: data,
//     });

//     return { source: mdxSource, frontMatter };
//   } catch (error) {
//     console.error("Error reading MDX file:", error);
//     throw new Error(`Failed to process MDX content for file: ${filePath}`);
//   }
// };

export const getMdxContents = async (
  slug: string[],
  fileDirectory: string,
): Promise<getMdxContentsResponse | null> => {
  const filePath = path.join(fileDirectory, ...slug) + ".mdx";

  try {
    // 파일 존재 여부 확인
    await fs.access(filePath);
  } catch (error) {
    console.error("File not found:", error);
    return null;
  }

  // MDX 파일 읽기 및 파싱
  const source = await fs.readFile(filePath, "utf8");
  const { content, data } = matter(source);
  const frontMatter = data as FrontMatterProps;

  if (!frontMatter.title) {
    throw new Error("Front matter does not contain required 'title' field");
  }

  // rehypePrettyCode 설정
  const rehypePrettyCodeOptions: Options = {
    theme: "github-dark",
    onVisitLine(node: any) {
      if (node.children && node.children.length === 0) {
        node.children = [{ type: "text", value: " " }];
      }
    },
    onVisitHighlightedLine(node: any) {
      node.properties = {
        ...node.properties,
        className: [...(node.properties?.className || []), "highlighted-line"],
      };
    },
    onVisitHighlightedChars(node: any) {
      node.properties = {
        ...node.properties,
        className: ["highlighted-word"],
      };
    },
  };

  // 콘텐츠 헤더 추출
  const heading: HeadingsProps[] = extractHeadings(content);

  // MDX 소스 직렬화
  const mdxSource = await serialize(content, {
    mdxOptions: {
      rehypePlugins: [
        [rehypeHeadingsWithIds, heading],
        [rehypePrettyCode, rehypePrettyCodeOptions],
        [
          rehypeExternalLinks,
          { target: "_blank", rel: ["noopener", "noreferrer"] },
        ],
        rehypeCodeBlockClassifier,
      ],
    },
    scope: data,
  });

  // 평문 콘텐츠 및 읽기 시간 계산
  const plainTextContent = extractPlainText(content);
  const readingTime = calculateReadingTime(plainTextContent);

  // 모든 게시물 가져오기
  const { postList: allPosts } = await getAllPosts({});

  // 현재, 이전, 다음 게시물 탐색
  const currentIndex = allPosts.findIndex(
    (post) => post.slug === slug.join("/"),
  );
  const previousPost =
    currentIndex > 0
      ? {
          slug: allPosts[currentIndex - 1].slug,
          title: allPosts[currentIndex - 1].title,
        }
      : null;
  const nextPost =
    currentIndex < allPosts.length - 1
      ? {
          slug: allPosts[currentIndex + 1].slug,
          title: allPosts[currentIndex + 1].title,
        }
      : null;

  // 관련 게시물 찾기
  const relatedPosts = findRelatedPost(allPosts, slug, frontMatter);

  return {
    source: mdxSource,
    frontMatter,
    readingTime,
    heading,
    previousPost,
    nextPost,
    relatedPosts,
  };
};

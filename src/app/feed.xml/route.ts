import { getAllPosts } from "@/utils/post";
import { BASE_URL, BASE_META_TITLE } from "@/constants/basic.constants";

export async function GET() {
  const { postList } = await getAllPosts({ isSorted: true });

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${BASE_META_TITLE}</title>
    <link>${BASE_URL}</link>
    <description>프론트엔드 개발자 김형석의 개발 블로그</description>
    ${postList
      .map(
        (post) => `
      <item>
        <title>${post.title}</title>
        <link>${BASE_URL}/posts/${post.slug}</link>
        <description>${post.description || ""}</description>
        <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
      </item>
    `,
      )
      .join("")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}

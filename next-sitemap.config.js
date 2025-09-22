// next-sitemap.config.js (ESM)
import fs from "node:fs";
import path from "node:path";

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  generateRobotsTxt: true,
  trailingSlash: false,
  sitemapSize: 5000,
  autoLastmod: true,
  additionalPaths: async () => {
    const POSTS_DIR = path.join(process.cwd(), "src", "posts");
    const entries = [];

    if (fs.existsSync(POSTS_DIR)) {
      const walk = (dir) => {
        for (const name of fs.readdirSync(dir)) {
          const p = path.join(dir, name);
          const stat = fs.statSync(p);
          if (stat.isDirectory()) {
            walk(p);
          } else if (p.endsWith(".mdx") || p.endsWith(".md")) {
            const rel = p.replace(POSTS_DIR, "").replace(/\.mdx?$/, "");
            const slug = rel.split(path.sep).filter(Boolean).join("/");
            entries.push({
              loc: `${process.env.NEXT_PUBLIC_SITE_URL}/posts/${slug}`,
              lastmod: new Date().toISOString(),
              changefreq: "weekly",
              priority: 0.7,
            });
          }
        }
      };
      walk(POSTS_DIR);
    }

    return entries;
  },
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/api/"] },
    ],
  },
};

export default config;

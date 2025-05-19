import withMDX from "@next/mdx";
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const require = createRequire(import.meta.url);

const withMDXConfig = withMDX({
  extension: /\.mdx?$/,
  experimental: {
    esmExternals: true,
  },
  transpilePackages: ["next-mdx-remote"],
});

// 조건부로 bundle-analyzer 적용
let withAnalyzer = (config) => config;
if (process.env.NODE_ENV !== "production") {
  try {
    withAnalyzer = require("@next/bundle-analyzer")({
      enabled: process.env.ANALYZE === "true",
    });
  } catch (e) {
    console.warn("⚠️ bundle-analyzer 로딩 실패, 개발 환경에서만 작동합니다.");
  }
}

// 중첩: MDX → Analyzer → Config
const nextConfig = withAnalyzer(
  withMDXConfig({
    pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
    webpack(config) {
      config.module.rules.push({
        test: /\.svg$/,
        use: [
          {
            loader: "@svgr/webpack",
            options: {
              svgo: false,
            },
          },
        ],
      });
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        "@": path.resolve(__dirname, "src"),
      };

      return config;
    },
    images: {
      domains: ["avatars.githubusercontent.com"],
    },
    eslint: { ignoreDuringBuilds: true },
  }),
);

export default nextConfig;

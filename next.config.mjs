import withMDX from "@next/mdx";
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const withMDXConfig = withMDX({
  extension: /\.mdx?$/,
});

let withAnalyzer = (config) => config;
if (process.env.NODE_ENV !== "production") {
  try {
    withAnalyzer = require("@next/bundle-analyzer")({
      enabled: process.env.ANALYZE === "true",
      openAnalyzer: true,
      analyzerMode: "static",
    });
  } catch (e) {
    console.warn("⚠️ bundle-analyzer 로딩 실패, 개발 환경에서만 작동합니다.");
  }
}

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
    trailingSlash: false,
    images: {
      domains: ["avatars.githubusercontent.com"],
      deviceSizes: [320, 480, 640, 768, 1024, 1280, 1440, 1920],
      imageSizes: [16, 32, 64, 96, 128, 256, 384],
    },
    eslint: { ignoreDuringBuilds: true },
    swcMinify: true,
    experimental: {
      esmExternals: false,
    },
    compiler: {
      removeConsole: process.env.NODE_ENV === "production",
    },
  }),
);

export default nextConfig;

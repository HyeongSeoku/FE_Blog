import withMDX from "@next/mdx";
import path from "path";
import { optimizeImagesInDir } from "./script/optimize-images.js";

const CONTENT_IMAGE_DIR = path.join(process.cwd(), "public/content-images");

const nextConfig = withMDX({
  extension: /\.mdx?$/,
  transpilePackages: ["next-mdx-remote"],
})({
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

    // Webpack 빌드 전에 이미지 최적화 실행
    config.plugins.push({
      apply: (compiler) => {
        let isOptimized = false; // 플래그를 여기로 이동

        compiler.hooks.beforeRun.tapPromise(
          "OptimizeImagesPlugin",
          async () => {
            if (isOptimized) {
              console.log("이미 최적화가 완료되었습니다. 건너뜁니다.");
              return;
            }

            console.log("이미지 최적화 시작...");
            await optimizeImagesInDir(CONTENT_IMAGE_DIR);
            console.log("이미지 최적화 완료!");
          },
        );
      },
    });

    return config;
  },

  transpilePackages: ["next-mdx-remote"],
  images: {
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "avatars.githubusercontent.com",
    //     port: "",
    //     search: "",
    //   },
    // ],
    domains: ["avatars.githubusercontent.com"],
  },
});

export default nextConfig;

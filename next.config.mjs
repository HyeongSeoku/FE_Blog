import withMDX from "@next/mdx";
import withBundleAnalyzer from "@next/bundle-analyzer";
const withMDXConfig = withMDX({
  extension: /\.mdx?$/,
  experimental: {
    esmExternals: true,
  },
  transpilePackages: ["next-mdx-remote"],
});

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

// 중첩해서 구성: MDX → Analyzer → Config
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
      return config;
    },
    images: {
      domains: ["avatars.githubusercontent.com"],
    },
    eslint: { ignoreDuringBuilds: true },
  }),
);

export default nextConfig;

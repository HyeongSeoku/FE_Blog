// next.config.mjs
import withMDX from "@next/mdx";

const nextConfig = withMDX({
  extension: /\.mdx?$/,
})({
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
});

export default nextConfig;

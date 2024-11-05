import withMDX from "@next/mdx";
import rehypePrism from "rehype-prism-plus";

const nextConfig = withMDX({
  extension: /\.mdx?$/,
  options: {
    rehypePlugins: [rehypePrism],
  },
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

    return config;
  },

  transpilePackages: ["next-mdx-remote"],
});

export default nextConfig;

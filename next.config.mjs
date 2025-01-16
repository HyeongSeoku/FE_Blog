import withMDX from "@next/mdx";

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

    return config;
  },

  images: {
    domains: ["avatars.githubusercontent.com"],
  },
});

export default nextConfig;

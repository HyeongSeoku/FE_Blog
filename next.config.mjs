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

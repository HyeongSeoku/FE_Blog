// next.config.mjs
import withMDX from "@next/mdx";

const nextConfig = withMDX({
  extension: /\.mdx?$/,
})({
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
});

export default nextConfig;

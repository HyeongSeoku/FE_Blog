/** @type {import('postcss-load-config').Config} */
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import postcssNesting from "postcss-nesting";

const config = {
  plugins: {
    "postcss-nesting": postcssNesting,
    tailwindcss,
    autoprefixer,
  },
};

export default config;

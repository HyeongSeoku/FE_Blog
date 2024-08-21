import type { Config } from "tailwindcss";
import fs from "fs";
import path from "path";
import postcss from "postcss";
import tailwindcss from "tailwindcss";

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    screens: {
      xs: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      fontFamily: {
        sans: ["Pretendard", "sans-serif"],
      },
    },
  },
  plugins: [
    function ({
      addUtilities,
      addBase,
    }: {
      addUtilities: (utilities: Record<string, Record<string, string>>) => void;
      addBase: (baseStyles: Record<string, Record<string, string>>) => void;
    }) {
      const newUtilities = {
        ".scrollbar-thin": {
          "scrollbar-width": "thin",
        },
        ".scrollbar-none": {
          "scrollbar-width": "none",
        },
      };

      addUtilities(newUtilities);

      // markdown.css 파일 읽어오기
      const markdownCSSPath = path.resolve(
        __dirname,
        "./src/styles/markdown.css",
      );
      const markdownCSS = fs.readFileSync(markdownCSSPath, "utf-8");

      // CSS 문자열을 JavaScript 객체로 변환하여 추가
      parseAndApplyCSS(markdownCSS)
        .then((markdownStyles) => {
          addBase(markdownStyles);
        })
        .catch((err) => {
          console.error("Error processing CSS:", err);
        });
    },
  ],
} satisfies Config;

async function parseAndApplyCSS(
  cssString: string,
): Promise<Record<string, Record<string, string>>> {
  const styles: Record<string, Record<string, string>> = {};

  try {
    const result = await postcss([tailwindcss]).process(cssString, {
      from: undefined,
    });

    result.root.walkRules((rule) => {
      const selector = rule.selector;
      const rules: Record<string, string> = {};
      rule.walkDecls((decl) => {
        rules[decl.prop] = decl.value;
      });
      styles[selector] = rules;
    });
  } catch (error) {
    console.error("Failed to parse CSS:", error);
  }

  return styles;
}

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
      scale: {
        "102": "1.02",
      },
      colors: {
        primary: "var(--primary-color)",
      },
      keyframes: {
        easeInTypingEffect: {
          "0%": {
            opacity: "0",
            clipPath: "inset(0 100% 0 0)",
          },
          "100%": {
            opacity: "1",
            clipPath: "inset(0 0 0 0)",
          },
        },

        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      animation: {
        easeInTypingEffect: "easeInTypingEffect 1s ease-in-out forwards",
        blink: "blink 1s step-end infinite",
        blinkEaseInOut: "blink 1.5s infinite ease-in-out",
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

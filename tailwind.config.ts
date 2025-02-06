import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    screens: {
      xs: { max: "375px" },
      sm: { max: "640px" },
      md: { max: "768px" },
      lg: { max: "1024px" },
      xl: { max: "1280px" },
      "2xl": { max: "1536px" },
      "min-md": { min: "768px" },
      "min-lg": { min: "1024px" },
      "md-lg": { min: "769px", max: "1023px" },
    },
    extend: {
      textColor: {
        theme: "var(--text-color)",
        "opposite-theme": "var(--contrasting-text-color)",
      },
      scale: {
        "102": "1.02",
      },
      colors: {
        primary: "var(--primary-color)",
        "primary-hover": "var(--primary-hover-color)",
        theme: "var(--bg-color)",
      },
      transitionDuration: {
        custom: "var(--transition-duration)",
      },
      transitionTimingFunction: {
        custom: "var(--transition-timing-function)",
      },
      keyframes: {
        bounceSlight: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-1.5px)" },
        },
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

        rotateFull: {
          from: {
            transform: "rotate(0deg)",
          },
          to: {
            transform: "rotate(360deg)",
          },
        },
        rotateQuarter: {
          "0%, 100%": {
            transform: "rotate(0deg)",
          },
          "50%": {
            transform: "rotate(40deg)",
          },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        shimmer: {
          "0%": {
            "background-position": "-100% 0",
          },
          "100%": {
            "background-position": "100% 0",
          },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(5px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-5px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInLeft: {
          "0%": { opacity: "0", transform: "translateX(-5px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        fadeInRight: {
          "0%": { opacity: "0", transform: "translateX(5px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        bounceJelly: {
          "0%": {
            transform: "matrix(0, 0, 0, 0, 0, 0)",
          },

          "3.4%": {
            transform: "matrix(0.316, 0, 0, 0.407, 0, 0)",
          },

          "4.7%": {
            transform: "matrix(0.45, 0, 0, 0.599, 0, 0)",
          },

          "6.81%": {
            transform: "matrix(0.659, 0, 0, 0.893, 0, 0)",
          },

          "9.41%": {
            transform: "matrix(0.883, 0, 0, 1.168, 0, 0)",
          },

          "10.21%": {
            transform: "matrix(0.942, 0, 0, 1.226, 0, 0)",
          },

          "13.61%": {
            transform: "matrix(1.123, 0, 0, 1.332, 0, 0)",
          },

          "14.11%": {
            transform: "matrix(1.141, 0, 0, 1.331, 0, 0)",
          },

          "17.52%": {
            transform: "matrix(1.208, 0, 0, 1.239, 0, 0)",
          },

          "18.72%": {
            transform: "matrix(1.212, 0, 0, 1.187, 0, 0)",
          },

          "21.32%": {
            transform: "matrix(1.196, 0, 0, 1.069, 0, 0)",
          },

          "24.32%": {
            transform: "matrix(1.151, 0, 0, 0.96, 0, 0)",
          },

          "25.23%": {
            transform: "matrix(1.134, 0, 0, 0.938, 0, 0)",
          },

          "29.03%": {
            transform: "matrix(1.063, 0, 0, 0.897, 0, 0)",
          },

          "29.93%": {
            transform: "matrix(1.048, 0, 0, 0.899, 0, 0)",
          },

          "35.54%": {
            transform: "matrix(0.979, 0, 0, 0.962, 0, 0)",
          },

          "36.74%": {
            transform: "matrix(0.972, 0, 0, 0.979, 0, 0)",
          },

          "41.04%": {
            transform: "matrix(0.961, 0, 0, 1.022, 0, 0)",
          },

          "44.44%": {
            transform: "matrix(0.966, 0, 0, 1.032, 0, 0)",
          },

          "52.15%": {
            transform: "matrix(0.991, 0, 0, 1.006, 0, 0)",
          },

          "59.86%": {
            transform: "matrix(1.006, 0, 0, 0.99, 0, 0)",
          },

          "63.26%": {
            transform: "matrix(1.007, 0, 0, 0.992, 0, 0)",
          },

          "75.28%": {
            transform: "matrix(1.001, 0, 0, 1.003, 0, 0)",
          },

          "85.49%": {
            transform: "matrix(0.999, 0, 0, 1, 0, 0)",
          },

          "90.69%": {
            transform: "matrix(0.999, 0, 0, 0.999, 0, 0)",
          },

          to: {
            transform: "matrix(1, 0, 0, 1, 0, 0)",
          },
        },
      },
      animation: {
        easeInTypingEffect: "easeInTypingEffect 1s ease-in-out forwards",
        blink: "blink 1s step-end infinite",
        blinkEaseInOut: "blink 1.5s infinite ease-in-out",
        rotateFull: "rotateFull 3s linear infinite",
        rotateQuarter: "rotateQuarter 1s linear infinite",
        bounceJelly: "bounceJelly 1s linear both",
        fadeInUp: "fadeInUp 0.5s ease-in-out forwards",
        fadeInDown: "fadeInDown 0.5s ease-in-out forwards",
        fadeInLeft: "fadeInLeft 0.5s ease-in-out forwards",
        fadeInRight: "fadeInRight 0.5s ease-in-out forwards",
        bounceSlight: "bounceSlight 1s infinite",
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
        ".animation-paused": {
          "animation-play-state": "paused",
        },
        ".animation-running": {
          "animation-play-state": "running",
        },
        ".will-change-transform-opacity": {
          willChange: "transform, opacity",
        },
      };

      addUtilities(newUtilities);
    },
  ],
} satisfies Config;

import { LIGHT_DARK_THEME } from "@/constants/cookie.constants";

export default function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function () {
          try {
            var cookies = document.cookie.split("; ");
            var theme = null;
            for (var i = 0; i < cookies.length; i++) {
              var cookie = cookies[i].split("=");
              if (cookie[0].trim() === "${LIGHT_DARK_THEME}") {
                theme = cookie[1];
                break;
              }
            }
            if (theme !== "dark" && theme !== "light") {
              theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
              document.cookie = "${LIGHT_DARK_THEME}=" + theme + "; path=/; SameSite=Lax";
            }
            document.documentElement.setAttribute(
              "data-theme",
              theme === "dark" ? "dark" : "light"
            );
          } catch (e) {
            console.error("Theme script error:", e);
          }
        })();`,
      }}
    />
  );
}

export default function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function () {
              try {
                var cookies = document.cookie.split("; ");
                var theme = "light";
                for (var i = 0; i < cookies.length; i++) {
                  var cookie = cookies[i].split("=");
                  if (cookie[0] === "LIGHT_DARK_THEME") {
                    theme = cookie[1];
                    break;
                  }
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

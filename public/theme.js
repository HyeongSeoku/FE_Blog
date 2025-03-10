(function () {
  try {
    let cookies = document.cookie.split("; ");
    let theme = "light";

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].split("=");
      if (cookie[0] === "LIGHT_DARK_THEME") {
        theme = cookie[1];
        break;
      }
    }

    document.documentElement.setAttribute(
      "data-theme",
      theme === "dark" ? "dark" : "light",
    );
  } catch (e) {
    console.error("Theme script error:", e);
  }
})();

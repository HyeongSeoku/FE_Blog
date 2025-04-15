module.exports = {
  ci: {
    collect: {
      startServerCommand: "pnpm run start",
      url: ["http://localhost:3000"],
      numberOfRuns: 1,
    },
    upload: {
      target: "filesystem",
      outputDir: "./.lighthouseci",
      reportFilenamePattern: "report.html",
    },
  },
};

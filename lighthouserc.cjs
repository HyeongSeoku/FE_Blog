module.exports = {
  ci: {
    collect: {
      startServerCommand: "pnpm run start",
      url: ["http://localhost:3000"],
      numberOfRuns: 1,
    },
    upload: {
      target: "github",
      githubToken: process.env.LHCI_GITHUB_APP_TOKEN,
    },
  },
};

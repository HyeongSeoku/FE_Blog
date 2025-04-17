module.exports = {
  ci: {
    collect: {
      startServerCommand: "pnpm run start",
      url: ["http://localhost:3000"],
      numberOfRuns: 1,
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};

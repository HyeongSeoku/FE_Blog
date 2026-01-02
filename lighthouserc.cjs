module.exports = {
  ci: {
    collect: {
      url: [process.env.LHCI_URL || "http://localhost:3000"],
      numberOfRuns: 1,
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};

module.exports = {
  apps: [
    {
      name: "seoku-blog",
      script: "pnpm",
      args: "start",
      cwd: "/my-app/seoku-blog",
      env: {
        PORT: 3000,
      },
    },
  ],
};

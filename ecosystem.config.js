module.exports = {
  apps: [
    {
      name: "seoku-blog",
      script: "pnpm",
      args: "start",
      cwd: "/home/ubuntu/actions-runner/_work/FE_Blog/FE_Blog/release",
      env: {
        PORT: 3000,
      },
    },
  ],
};

module.exports = {
  apps: [
    {
      name: "seoku-blog",
      script: "./node_modules/next/dist/bin/next",
      args: "start -p 3000",
      cwd: "/home/ubuntu/actions-runner/_work/FE_Blog/FE_Blog/release",
      env: {
        PORT: 3000,
        NODE_ENV: "production",
      },
    },
  ],
};

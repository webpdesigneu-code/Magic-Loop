module.exports = {
  apps: [
    {
      name: 'handmade-by-anna',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};

module.exports = {
  apps: [
    {
      name: 'handmade',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        RESEND_API_KEY: 're_ExfjwLKg_47H1s3J7ntdyu3KBBTEdH1JS',
        ANNA_EMAIL: 'apietrowicz87@gmail.com',
        ADMIN_PASSWORD: 'MagicLoop2024!',
      },
    },
  ],
};

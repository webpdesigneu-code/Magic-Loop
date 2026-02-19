module.exports = {
    apps: [{
        name: 'handmade-by-anna',
        script: 'node_modules/next/dist/bin/next',
        args: 'start -p 3002',
        cwd: '/var/www/handmade-by-anna',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '500M',
        env: {
            NODE_ENV: 'production',
            PORT: 3002
        }
    }]
};

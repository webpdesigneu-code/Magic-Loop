#!/bin/bash
# fix_nginx_ip.sh

NGINX_CONF="/etc/nginx/sites-available/default"

# Backup
cp $NGINX_CONF "$NGINX_CONF.bak_ip_$(date +%s)"

echo "Configuring Nginx to proxy IP to port 3000..."

cat > $NGINX_CONF <<EOF
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Test and Reload
nginx -t && systemctl reload nginx
echo "Nginx reloaded. App should be accessible on port 80."

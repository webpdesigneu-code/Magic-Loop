#!/bin/bash
VPS_USER="root"
VPS_HOST="93.127.214.180"

echo "🔥 Configuring Firewall on $VPS_HOST..."

ssh -t $VPS_USER@$VPS_HOST "
echo '--- Current Status ---'
ufw status

echo -e '\n--- Allowing Nginx (HTTP/HTTPS) ---'
ufw allow 'Nginx Full'
ufw reload

echo -e '\n--- New Status ---'
ufw status verbose
"

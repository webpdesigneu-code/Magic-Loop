#!/bin/bash
VPS_USER="root"
VPS_HOST="93.127.214.180"

echo "🔍 Running diagnostics on $VPS_HOST..."

ssh -t $VPS_USER@$VPS_HOST "
echo '--- 1. Checking TCP Ports ---'
netstat -tulpn | grep 3000 || echo '❌ Nothing on port 3000'

echo -e '\n--- 2. Checking Local Access ---'
curl -I http://localhost:3000 || echo '❌ Cannot access localhost:3000'

echo -e '\n--- 3. Checking Firewall (UFW) ---'
ufw status verbose || echo '❓ UFW not installed/active'

echo -e '\n--- 4. Checking Nginx ---'
systemctl status nginx --no-pager | head -n 5 || echo '❌ Nginx not running'
"

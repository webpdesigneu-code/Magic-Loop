#!/bin/bash
# Configuration
VPS_USER="root"
VPS_HOST="93.127.214.180"

echo "🔌 Connecting to $VPS_USER@$VPS_HOST..."

# 1. Delete the old process (id 0)
# 2. Restart the new process (handmade / id 1) to ensure it binds to port 3000
# 3. Save the changes so they persist after reboot
echo "🧹 Cleaning up PM2 processes..."
ssh -t $VPS_USER@$VPS_HOST "pm2 delete 0; pm2 restart handmade; pm2 save; pm2 list"

echo "✅ Process cleanup done."
echo "⏳ Waiting 5 seconds for the app to start..."
sleep 5

# 4. Check logs to see if it started correctly
echo "📋 Checking recent logs:"
ssh -t $VPS_USER@$VPS_HOST "pm2 logs handmade --lines 20 --nostream"

echo "🚀 Try visiting http://$VPS_HOST now!"

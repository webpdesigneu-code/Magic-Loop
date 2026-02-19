#!/bin/bash

# ===========================================
# Deploy Script for Handmade by Anna
# ===========================================

# Configuration
SERVER="root@93.127.214.180"
REMOTE_DIR="/var/www/handmade-by-anna"
LOCAL_DIR="$(dirname "$0")/.."

echo "🚀 Starting deployment to Hostinger VPS..."

# 1. Build production bundle locally
echo "📦 Building production bundle..."
cd "$LOCAL_DIR"
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# 2. Create remote directory
echo "📁 Creating remote directory..."
ssh $SERVER "mkdir -p $REMOTE_DIR"

# 3. Sync files to server (excluding dev dependencies)
echo "📤 Syncing files to server..."
rsync -avz --delete \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude '.next/cache' \
    --exclude '.env.local' \
    "$LOCAL_DIR/" "$SERVER:$REMOTE_DIR/"

# 4. Copy environment file separately
echo "🔐 Copying environment configuration..."
scp "$LOCAL_DIR/.env.local" "$SERVER:$REMOTE_DIR/.env.local"

# 5. Install dependencies on server
echo "📥 Installing dependencies on server..."
ssh $SERVER "cd $REMOTE_DIR && npm install --production"

# 6. Setup PM2 process
echo "⚙️ Setting up PM2 process..."
ssh $SERVER "cd $REMOTE_DIR && pm2 delete handmade-by-anna 2>/dev/null; pm2 start deploy/ecosystem.config.js"

# 7. Save PM2 configuration
echo "💾 Saving PM2 configuration..."
ssh $SERVER "pm2 save"

echo "✅ Deployment complete!"
echo "🌐 App should be running on port 3002"
echo ""
echo "Next steps:"
echo "1. Configure Nginx with deploy/nginx.conf"
echo "2. Setup SSL with certbot"
echo "3. Point your domain to the server"

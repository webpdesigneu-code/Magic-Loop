#!/bin/bash

# Configuration
# ------------------------------------------------------------------------------
# Set your VPS details here or pass them as arguments
VPS_USER=""
VPS_HOST=""
REMOTE_DIR="/var/www/handmadybyanna"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Helper functions
print_status() {
    echo -e "${GREEN}[*] $1${NC}"
}

print_error() {
    echo -e "${RED}[!] $1${NC}"
}

check_command() {
    if [ $? -ne 0 ]; then
        print_error "$1 failed. Exiting."
        exit 1
    fi
}

# ------------------------------------------------------------------------------
# Main Script
# ------------------------------------------------------------------------------

# 1. Ask for VPS details if not set
if [ -z "$VPS_USER" ]; then
    read -p "Enter VPS Username (e.g., root): " VPS_USER
fi

if [ -z "$VPS_HOST" ]; then
    read -p "Enter VPS IP Address (e.g., 123.45.67.89): " VPS_HOST
fi

if [ -z "$VPS_USER" ] || [ -z "$VPS_HOST" ]; then
    print_error "VPS User and Host are required."
    exit 1
fi

REMOTE_URI="${VPS_USER}@${VPS_HOST}"

print_status "Deploying to ${REMOTE_URI}:${REMOTE_DIR}"

# 2. Build the project locally
print_status "Building project locally..."
npm run build
check_command "Build"

# 3. Prepare remote directory
print_status "Preparing remote directory..."
ssh -t $REMOTE_URI "mkdir -p $REMOTE_DIR && chown -R $VPS_USER:$VPS_USER $REMOTE_DIR"
check_command "Remote directory preparation"

# 4. Upload files
print_status "Uploading files (this may take a while)..."

# Upload essential files first
scp package.json package-lock.json next.config.ts .env.example $REMOTE_URI:$REMOTE_DIR/
check_command "Config upload"

# Upload folders (excluding node_modules and .git)
# Using rsync if available for better performance, falling back to scp -r
if command -v rsync &> /dev/null; then
    print_status "Using rsync for upload..."
    rsync -avz --exclude 'node_modules' --exclude '.git' --exclude '.next' ./ $REMOTE_URI:$REMOTE_DIR/
else
    print_status "rsync not found, falling back to scp (slower)..."
    scp -r app components lib public styles utils $REMOTE_URI:$REMOTE_DIR/
fi
check_command "File upload"

# Upload .next folder (build artifacts)
print_status "Uploading build artifacts (.next)..."
if command -v rsync &> /dev/null; then
    rsync -avz .next $REMOTE_URI:$REMOTE_DIR/
else
    scp -r .next $REMOTE_URI:$REMOTE_DIR/
fi
check_command "Build artifacts upload"


# 5. Remote setup
print_status "Running remote setup..."
ssh -t $REMOTE_URI "cd $REMOTE_DIR && npm install --production && pm2 reload ecosystem.config.js --update-env || pm2 start ecosystem.config.js"
check_command "Remote setup"

print_status "Deployment complete! Visit http://$VPS_HOST to verify."

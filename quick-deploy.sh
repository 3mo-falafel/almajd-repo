#!/bin/bash

# =============================================================================
# QUICK DEPLOYMENT SCRIPT - ALMAJD E-COMMERCE
# =============================================================================
# Simple script for quick updates without full checks
# Use this when you just need to pull latest changes and restart
# =============================================================================

set -e

REPO_DIR="/root/almajd-repo"
PM2_APP_NAME="almajd"

echo "🚀 Quick deployment starting..."

cd "$REPO_DIR"

echo "📥 Pulling latest changes..."
git stash push -m "Auto-stash $(date)" || true
git pull origin main

echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

echo "🏗️ Building application..."
npm run build

echo "🔄 Restarting application..."
pm2 restart "$PM2_APP_NAME"

echo "✅ Quick deployment completed!"
echo "📊 Application status:"
pm2 status

echo "🌐 Your app is running at: http://$(hostname -I | awk '{print $1}'):3000"

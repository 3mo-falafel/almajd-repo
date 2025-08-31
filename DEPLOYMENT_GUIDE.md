# DEPLOYMENT SCRIPTS SETUP AND USAGE GUIDE

## 📋 Files Created:
1. `deploy.sh` - Full deployment script with all features
2. `quick-deploy.sh` - Simple script for quick updates

## 🚀 Installation on VPS:

### Step 1: Upload scripts to your VPS
```bash
# From your local machine, upload the scripts
scp deploy.sh root@31.97.72.28:/root/
scp quick-deploy.sh root@31.97.72.28:/root/
```

### Step 2: Make scripts executable
```bash
# SSH into your VPS
ssh root@31.97.72.28

# Make scripts executable
chmod +x /root/deploy.sh
chmod +x /root/quick-deploy.sh
```

## 📖 Usage:

### Full Deployment Script (`deploy.sh`)
```bash
# Standard deployment
./deploy.sh

# Fresh deployment (removes existing repo)
./deploy.sh --fresh

# Deployment with backup
./deploy.sh --backup

# Quick deploy without building (for small changes)
./deploy.sh --no-build

# Fresh deployment with backup
./deploy.sh --fresh --backup

# Show help
./deploy.sh --help
```

### Quick Deployment Script (`quick-deploy.sh`)
```bash
# Simple quick update
./quick-deploy.sh
```

## 🎯 When to Use Which Script:

### Use `deploy.sh` when:
- ✅ First time deployment
- ✅ Major updates or changes
- ✅ Adding new dependencies
- ✅ Database schema changes
- ✅ Environment configuration changes
- ✅ You want backup before deployment

### Use `quick-deploy.sh` when:
- ⚡ Small code changes
- ⚡ UI updates
- ⚡ Quick bug fixes
- ⚡ Component modifications
- ⚡ You just want to pull and restart quickly

## 🛠️ Script Features:

### `deploy.sh` Features:
- 🔄 Automatic dependency installation
- 🏗️ Full build process
- 💾 Backup creation (optional)
- 🧹 Fresh deployment option
- 🏥 Health checks
- 📊 Comprehensive logging
- 🚨 Error handling
- 🧽 Cleanup processes
- ⚙️ PM2 configuration
- 🌍 Environment setup

### `quick-deploy.sh` Features:
- ⚡ Fast execution
- 📥 Git pull latest changes
- 📦 Dependency updates
- 🏗️ Build process
- 🔄 PM2 restart
- 📊 Status display

## 🔧 Customization:

You can modify these variables in the scripts:
```bash
REPO_URL="https://github.com/3mo-falafel/almajd-repo.git"
REPO_DIR="/root/almajd-repo"
PM2_APP_NAME="almajd"
PORT=3000
```

## 📝 Examples:

### Example 1: First deployment
```bash
./deploy.sh --fresh --backup
```

### Example 2: Regular update
```bash
./quick-deploy.sh
```

### Example 3: Major update with backup
```bash
./deploy.sh --backup
```

### Example 4: Quick fix without building
```bash
./deploy.sh --no-build
```

## 🚨 Troubleshooting:

### If deployment fails:
1. Check logs: `pm2 logs almajd`
2. Check PM2 status: `pm2 status`
3. Check disk space: `df -h`
4. Check permissions: `ls -la /root/almajd-repo`
5. Restart PM2: `pm2 restart almajd`

### Common issues:
- **Port already in use**: `sudo lsof -i :3000` then kill the process
- **Permission denied**: Make sure scripts are executable (`chmod +x`)
- **Git conflicts**: Scripts automatically stash local changes
- **Memory issues**: `pm2 restart almajd` or reboot VPS

## 📊 Monitoring:

### Check application status:
```bash
pm2 status
pm2 logs almajd
pm2 monit
```

### Check if site is accessible:
```bash
curl http://localhost:3000
curl http://31.97.72.28:3000
```

## 🔐 Security Notes:

- Scripts run as root (required for PM2 and system operations)
- Git credentials may be needed (consider SSH keys for passwordless access)
- Environment variables are preserved in .env file
- Backups are stored in `/root/backups` (only last 5 kept automatically)

## 💡 Pro Tips:

1. **Set up SSH keys** for passwordless GitHub access
2. **Use `quick-deploy.sh`** for daily updates
3. **Use `--backup`** flag for important deployments
4. **Monitor logs** after deployment: `pm2 logs almajd --lines 50`
5. **Test locally** before deploying to production

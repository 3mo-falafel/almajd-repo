#!/bin/bash

# =============================================================================
# ALMAJD E-COMMERCE DEPLOYMENT SCRIPT
# =============================================================================
# This script automates the deployment/redeployment of the almajd-repo
# from GitHub to the Hostinger VPS
# 
# Usage: ./deploy.sh [OPTIONS]
# Options:
#   --fresh     : Fresh deployment (removes existing repo)
#   --backup    : Creates backup before deployment
#   --no-build  : Skip npm build process
#   --help      : Show this help message
# =============================================================================

set -e  # Exit on any error

# Configuration
REPO_URL="https://github.com/3mo-falafel/almajd-repo.git"
REPO_DIR="/root/almajd-repo"
BACKUP_DIR="/root/backups"
PM2_APP_NAME="almajd"
NODE_VERSION="18"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Help function
show_help() {
    cat << EOF
ALMAJD E-COMMERCE DEPLOYMENT SCRIPT

Usage: ./deploy.sh [OPTIONS]

Options:
    --fresh     Fresh deployment (removes existing repo and starts clean)
    --backup    Creates backup before deployment
    --no-build  Skip npm build process (faster for small changes)
    --help      Show this help message

Examples:
    ./deploy.sh                    # Standard deployment
    ./deploy.sh --backup           # Deploy with backup
    ./deploy.sh --fresh --backup   # Fresh deployment with backup
    ./deploy.sh --no-build         # Quick deploy without building

EOF
}

# Parse command line arguments
FRESH_DEPLOY=false
CREATE_BACKUP=false
SKIP_BUILD=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --fresh)
            FRESH_DEPLOY=true
            shift
            ;;
        --backup)
            CREATE_BACKUP=true
            shift
            ;;
        --no-build)
            SKIP_BUILD=true
            shift
            ;;
        --help)
            show_help
            exit 0
            ;;
        *)
            error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    error "Please run this script as root"
    exit 1
fi

log "Starting ALMAJD deployment process..."

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Install/update system dependencies
install_dependencies() {
    log "Checking and installing system dependencies..."
    
    # Update package list
    apt update -qq
    
    # Install essential packages
    apt install -y curl git wget software-properties-common
    
    # Install Node.js if not present or wrong version
    if ! command_exists node || ! node --version | grep -q "v$NODE_VERSION"; then
        log "Installing Node.js $NODE_VERSION..."
        curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
        apt install -y nodejs
    fi
    
    # Install PM2 globally if not present
    if ! command_exists pm2; then
        log "Installing PM2..."
        npm install -g pm2
    fi
    
    success "Dependencies installed successfully"
}

# Create backup
create_backup() {
    if [ "$CREATE_BACKUP" = true ] && [ -d "$REPO_DIR" ]; then
        log "Creating backup..."
        
        mkdir -p "$BACKUP_DIR"
        BACKUP_NAME="almajd-backup-$(date +%Y%m%d-%H%M%S)"
        
        # Create backup
        cp -r "$REPO_DIR" "$BACKUP_DIR/$BACKUP_NAME"
        
        # Keep only last 5 backups
        cd "$BACKUP_DIR"
        ls -t | tail -n +6 | xargs -r rm -rf
        
        success "Backup created: $BACKUP_DIR/$BACKUP_NAME"
    fi
}

# Stop PM2 application
stop_application() {
    log "Stopping application..."
    if pm2 list | grep -q "$PM2_APP_NAME"; then
        pm2 stop "$PM2_APP_NAME" || true
        pm2 delete "$PM2_APP_NAME" || true
    fi
    success "Application stopped"
}

# Clone or update repository
setup_repository() {
    if [ "$FRESH_DEPLOY" = true ] && [ -d "$REPO_DIR" ]; then
        log "Removing existing repository for fresh deployment..."
        rm -rf "$REPO_DIR"
    fi
    
    if [ ! -d "$REPO_DIR" ]; then
        log "Cloning repository..."
        git clone "$REPO_URL" "$REPO_DIR"
        success "Repository cloned successfully"
    else
        log "Updating existing repository..."
        cd "$REPO_DIR"
        
        # Stash any local changes
        git stash push -m "Auto-stash before deployment $(date)" || true
        
        # Pull latest changes
        git fetch origin
        git reset --hard origin/main
        git clean -fd
        
        success "Repository updated successfully"
    fi
}

# Install dependencies and build
build_application() {
    log "Installing Node.js dependencies..."
    cd "$REPO_DIR"
    
    # Clear npm cache
    npm cache clean --force
    
    # Install dependencies
    npm install --legacy-peer-deps --production=false
    
    if [ "$SKIP_BUILD" = false ]; then
        log "Building application..."
        npm run build
        success "Application built successfully"
    else
        warning "Skipping build process"
    fi
}

# Setup environment variables
setup_environment() {
    log "Setting up environment variables..."
    cd "$REPO_DIR"
    
    # Check if .env file exists
    if [ ! -f ".env" ]; then
        warning ".env file not found. Creating template..."
        cat > .env << EOF
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=almajd_db
DB_USER=almajd_user
DB_PASSWORD=your_secure_password

# Application Configuration
NODE_ENV=production
PORT=3000

# Add your other environment variables here
EOF
        warning "Please update .env file with your actual configuration"
    fi
}

# Start application with PM2
start_application() {
    log "Starting application with PM2..."
    cd "$REPO_DIR"
    
    # Create PM2 ecosystem file if it doesn't exist
    if [ ! -f "ecosystem.config.js" ]; then
        cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: '$PM2_APP_NAME',
    script: './node_modules/.bin/next',
    args: 'start',
    cwd: '$REPO_DIR',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/$PM2_APP_NAME-error.log',
    out_file: '/var/log/pm2/$PM2_APP_NAME-out.log',
    log_file: '/var/log/pm2/$PM2_APP_NAME.log',
    time: true,
    watch: false,
    max_restarts: 3,
    restart_delay: 5000
  }]
};
EOF
    fi
    
    # Start with PM2
    pm2 start ecosystem.config.js
    pm2 save
    
    # Setup PM2 startup script
    pm2 startup systemd -u root --hp /root || true
    
    success "Application started successfully"
}

# Health check
health_check() {
    log "Performing health check..."
    
    sleep 5  # Wait for application to start
    
    # Check if PM2 process is running
    if pm2 list | grep -q "$PM2_APP_NAME.*online"; then
        success "PM2 process is running"
    else
        error "PM2 process is not running"
        pm2 logs "$PM2_APP_NAME" --lines 20
        exit 1
    fi
    
    # Check if port 3000 is listening
    if netstat -tlnp | grep -q ":3000 "; then
        success "Application is listening on port 3000"
    else
        error "Application is not listening on port 3000"
        exit 1
    fi
    
    # Test HTTP response
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        success "Application is responding to HTTP requests"
    else
        warning "Application may not be fully ready yet"
    fi
}

# Cleanup function
cleanup() {
    log "Cleaning up..."
    
    # Remove old log files (keep last 7 days)
    find /var/log/pm2 -name "*.log" -mtime +7 -delete 2>/dev/null || true
    
    # Clean npm cache
    npm cache clean --force 2>/dev/null || true
    
    success "Cleanup completed"
}

# Main deployment process
main() {
    log "=== ALMAJD DEPLOYMENT STARTED ==="
    
    # Pre-deployment steps
    install_dependencies
    create_backup
    stop_application
    
    # Deployment steps
    setup_repository
    build_application
    setup_environment
    start_application
    
    # Post-deployment steps
    health_check
    cleanup
    
    success "=== DEPLOYMENT COMPLETED SUCCESSFULLY ==="
    log "Application is now running at: http://$(hostname -I | awk '{print $1}'):3000"
    log "PM2 status: pm2 status"
    log "Application logs: pm2 logs $PM2_APP_NAME"
}

# Trap errors
trap 'error "Deployment failed at line $LINENO. Check the logs above."; exit 1' ERR

# Run main function
main

# Show final status
echo
log "=== DEPLOYMENT SUMMARY ==="
log "Repository: $REPO_URL"
log "Directory: $REPO_DIR"
log "PM2 App: $PM2_APP_NAME"
log "Port: 3000"
echo
pm2 status
echo
success "Deployment completed! Your application is ready."

#!/bin/bash

# Mission Control Systemd Service Installer
# Run this script with sudo to install the systemd service

set -e

echo "🚀 Installing Mission Control systemd service..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Please run with sudo: sudo ./install-service.sh"
    exit 1
fi

# Copy service file
cp mission-control.service /etc/systemd/system/

# Reload systemd
echo "📋 Reloading systemd..."
systemctl daemon-reload

# Enable service to start on boot
echo "✅ Enabling service to start on boot..."
systemctl enable mission-control.service

# Start the service
echo "🟢 Starting Mission Control..."
systemctl start mission-control.service

# Check status
echo ""
echo "📊 Service Status:"
systemctl status mission-control.service --no-pager

echo ""
echo "✨ Installation complete!"
echo ""
echo "Useful commands:"
echo "  sudo systemctl status mission-control    # Check status"
echo "  sudo systemctl stop mission-control      # Stop service"
echo "  sudo systemctl start mission-control     # Start service"
echo "  sudo systemctl restart mission-control   # Restart service"
echo "  sudo journalctl -u mission-control -f    # View logs"
echo ""
echo "Mission Control will be available at: http://$(hostname -I | awk '{print $1}'):3000"

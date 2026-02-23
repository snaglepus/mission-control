#!/bin/bash

# Mission Control User Systemd Service Installer
# This doesn't require sudo - installs as user service

set -e

echo "🚀 Installing Mission Control user systemd service..."

# Create user systemd directory if needed
mkdir -p ~/.config/systemd/user/

# Copy service file
cp mission-control-user.service ~/.config/systemd/user/mission-control.service

# Reload systemd
echo "📋 Reloading systemd..."
systemctl --user daemon-reload

# Enable service to start on user login
echo "✅ Enabling service to start on login..."
systemctl --user enable mission-control.service

# Start the service
echo "🟢 Starting Mission Control..."
systemctl --user start mission-control.service

# Check status
echo ""
echo "📊 Service Status:"
systemctl --user status mission-control.service --no-pager

echo ""
echo "✨ Installation complete!"
echo ""
echo "Useful commands:"
echo "  systemctl --user status mission-control    # Check status"
echo "  systemctl --user stop mission-control      # Stop service"
echo "  systemctl --user start mission-control     # Start service"
echo "  systemctl --user restart mission-control   # Restart service"
echo "  journalctl --user -u mission-control -f    # View logs"
echo ""
echo "Note: For auto-start on boot, you may need to enable linger:"
echo "  sudo loginctl enable-linger $(whoami)"
echo ""
echo "Mission Control will be available at: http://$(hostname -I | awk '{print $1}'):3000"

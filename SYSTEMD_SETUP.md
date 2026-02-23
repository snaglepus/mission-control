# Mission Control - Systemd Service Setup

## Quick Start

Choose ONE of the following installation methods:

### Option 1: System Service (Recommended - requires sudo)
This runs Mission Control as a system service, starting automatically on boot.

```bash
cd ~/.openclaw/workspace/STARTUPS/mission-control
sudo ./install-service.sh
```

### Option 2: User Service (no sudo required)
This runs Mission Control as your user, starting when you log in.

```bash
cd ~/.openclaw/workspace/STARTUPS/mission-control
./install-user-service.sh

# Optional: Enable auto-start on boot (run once with sudo)
sudo loginctl enable-linger $(whoami)
```

---

## Access Mission Control

Once running, access at:
```
http://YOUR_VPS_IP:3000
```

**Login Credentials:**
- Username: `robbie`
- Password: `Lennon7!`

---

## Management Commands

### System Service (if installed with sudo):
```bash
# Check status
sudo systemctl status mission-control

# Stop service
sudo systemctl stop mission-control

# Start service
sudo systemctl start mission-control

# Restart service
sudo systemctl restart mission-control

# View logs
sudo journalctl -u mission-control -f

# Disable auto-start on boot
sudo systemctl disable mission-control
```

### User Service:
```bash
# Check status
systemctl --user status mission-control

# Stop service
systemctl --user stop mission-control

# Start service
systemctl --user start mission-control

# Restart service
systemctl --user restart mission-control

# View logs
journalctl --user -u mission-control -f
```

---

## Configuration

Edit the service file to change:
- Port (default: 3000)
- Environment variables
- User permissions

**System service:** `/etc/systemd/system/mission-control.service`
**User service:** `~/.config/systemd/user/mission-control.service`

After editing:
```bash
sudo systemctl daemon-reload
sudo systemctl restart mission-control
```

---

## Troubleshooting

### Service won't start
Check logs:
```bash
sudo journalctl -u mission-control -n 50
```

### Port already in use
Change the port in the service file:
```
Environment=PORT=3001
```

### Environment variables not loading
Make sure they're set in the service file or loaded from `.env.local`

---

## Features

- ✅ Auto-start on boot
- ✅ Automatic restart on crash
- ✅ HTTP Basic Auth protection
- ✅ Real-time Todoist integration
- ✅ Real-time Fireflies integration
- ✅ Client Command Center
- ✅ Meeting Intelligence
- ✅ Task Mission Control

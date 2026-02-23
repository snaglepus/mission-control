# Mission Control 🚀

A personal dashboard for managing consulting engagements, meetings, and tasks with real-time integrations.

![Dashboard](https://img.shields.io/badge/Dashboard-Live-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/License-Private-red)

---

## ✨ Features

### 🔐 Security
- **HTTP Basic Auth** - Password protection for all routes
- **HTTPS/SSL** - Let's Encrypt SSL certificates
- **VPS Deployment** - Self-hosted on your own server

### 📊 Three Integrated Tools

#### 1. Client Command Center
Manage all consulting clients in one place:
- Client overview with health scores
- Revenue tracking per client
- Upcoming deliverables and deadlines
- Status indicators (Active, At-Risk, Prospective, Completing)
- Quick access to client details

#### 2. Meeting Intelligence
Fireflies-powered meeting analytics:
- **Real-time sync** with Fireflies.ai (30s polling)
- Meeting summaries and key insights
- Action item extraction
- Attendee tracking
- Direct links to transcripts
- Client auto-detection from meeting titles

#### 3. Task Mission Control
Todoist-powered task management:
- **Real-time sync** with Todoist (30s polling)
- Priority-based organization (P1-P4)
- Time estimate tracking (min/hour/day projects)
- **Olivia task detection** - Auto-identifies tasks tagged for AI assistant
- Workload monitoring with daily limits
- Client tags (@CoverMore, @GuideDogs, etc.)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│           Nginx (Reverse Proxy)             │
│         SSL Termination + Auth              │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│         Mission Control (Next.js)           │
│  ┌─────────────┐ ┌─────────────┐           │
│  │   Client    │ │  Meeting    │           │
│  │  Command    │ │  Intel      │           │
│  └─────────────┘ └─────────────┘           │
│  ┌─────────────┐                           │
│  │   Task      │                           │
│  │  Control    │                           │
│  └─────────────┘                           │
└──────────┬─────────────────┬────────────────┘
           │                 │
    ┌──────▼──────┐   ┌─────▼──────┐
    │   Todoist   │   │  Fireflies │
    │     API     │   │     API    │
    └─────────────┘   └────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- NPM or Yarn
- A VPS with Ubuntu/Debian (for production)
- Domain name pointing to your VPS (for HTTPS)

### Local Development

```bash
# Clone the repository
git clone https://github.com/snaglepus/mission-control.git
cd mission-control

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Default credentials:**
- Username: `robbie`
- Password: `Lennon7!`

---

## 🔧 Production Deployment

### Step 1: Build the Application

```bash
npm run build
```

### Step 2: Set Up Systemd Service

```bash
# Option A: System service (requires sudo)
sudo ./install-service.sh

# Option B: User service (no sudo required)
./install-user-service.sh

# Optional: Enable auto-start on boot for user service
sudo loginctl enable-linger $(whoami)
```

This will:
- Create a systemd service
- Enable auto-start on boot
- Start the service immediately
- Configure auto-restart on crash

### Step 3: Set Up HTTPS/SSL

**Prerequisites:**
- Domain name pointing to your VPS IP
- Ports 80 and 443 open in firewall

```bash
# Quick setup (one-liner)
sudo ./quick-https.sh mission.yourdomain.com

# Or interactive setup
sudo ./setup-https.sh
```

This will:
- Install Nginx
- Install Certbot (Let's Encrypt)
- Configure Nginx as reverse proxy
- Obtain SSL certificate
- Set up auto-renewal
- Secure Mission Control behind proxy

### Step 4: Verify Deployment

```bash
# Check all services
sudo systemctl status nginx
sudo systemctl status mission-control

# View logs
sudo journalctl -u mission-control -f
sudo tail -f /var/log/nginx/access.log

# Test HTTPS
curl -I https://mission.yourdomain.com
```

---

## 🔌 API Integrations

### Todoist
**Endpoint:** `/api/todoist`  
**Refresh:** Every 30 seconds  
**Features:**
- Fetch all active tasks
- Priority levels (P1-P4)
- Project categorization (min/hour/day/inbox)
- Label detection (including "Olivia" tag)
- Due date tracking
- Client extraction from labels

### Fireflies
**Endpoint:** `/api/fireflies`  
**Refresh:** Every 30 seconds  
**Features:**
- Fetch recent meeting transcripts
- Participant tracking
- Client auto-detection from meeting titles
- Direct links to Fireflies app
- Meeting duration calculation

---

## 📁 Project Structure

```
mission-control/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── fireflies/       # Fireflies API integration
│   │   │   │   └── route.ts
│   │   │   └── todoist/         # Todoist API integration
│   │   │       └── route.ts
│   │   ├── components/
│   │   │   ├── ClientCommandCenter.tsx
│   │   │   ├── MeetingIntelligence.tsx
│   │   │   └── TaskMissionControl.tsx
│   │   ├── hooks/
│   │   │   └── useRealtimeData.ts   # Real-time polling hook
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── page.tsx             # Main dashboard
│   └── middleware.ts            # Basic auth protection
├── .env.local                   # Environment variables
├── .env.local.example           # Example env file
├── next.config.js
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── install-service.sh           # Systemd installer (system)
├── install-user-service.sh      # Systemd installer (user)
├── setup-https.sh               # HTTPS setup script
├── quick-https.sh               # Quick HTTPS setup
├── mission-control.service      # Systemd service file (system)
├── mission-control-user.service # Systemd service file (user)
├── SYSTEMD_SETUP.md             # Service setup documentation
├── HTTPS_SETUP.md               # SSL setup documentation
└── README.md                    # This file
```

---

## 🛠️ Environment Variables

Create `.env.local` from the example:

```bash
cp .env.local.example .env.local
```

| Variable | Description | Required |
|----------|-------------|----------|
| `TODOIST_API_TOKEN` | Your Todoist API token | ✅ Yes |
| `FIREFLIES_API_KEY` | Your Fireflies API key | ✅ Yes |
| `AUTH_USERNAME` | Basic auth username | ✅ Yes |
| `AUTH_PASSWORD` | Basic auth password | ✅ Yes |
| `PORT` | Server port (default: 3000) | ❌ No |
| `HOSTNAME` | Bind address (default: 0.0.0.0) | ❌ No |

### Getting API Keys

**Todoist:**
1. Go to https://todoist.com/app/settings/integrations
2. Scroll to "API token"
3. Copy the token

**Fireflies:**
1. Go to https://app.fireflies.ai/settings
2. Click "Integrations"
3. Copy your API key

---

## 📊 Monitoring & Management

### Service Management

```bash
# Check status
sudo systemctl status mission-control

# View logs
sudo journalctl -u mission-control -f

# Restart service
sudo systemctl restart mission-control

# Stop service
sudo systemctl stop mission-control
```

### SSL Certificate Management

```bash
# Check certificate status
sudo certbot certificates

# Test auto-renewal
sudo certbot renew --dry-run

# Force renewal
sudo certbot renew --force-renewal

# View renewal logs
sudo journalctl -u certbot.timer
```

### Nginx Management

```bash
# Test configuration
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx

# View access logs
sudo tail -f /var/log/nginx/access.log

# View error logs
sudo tail -f /var/log/nginx/error.log
```

---

## 🔐 Security Considerations

1. **Always use HTTPS in production** - The setup scripts configure this automatically
2. **Change default password** - Update `AUTH_PASSWORD` in `.env.local`
3. **Keep API keys secret** - Never commit `.env.local` to git
4. **Bind to localhost** when using reverse proxy - Set `HOSTNAME=127.0.0.1`
5. **Regular updates** - Keep system packages updated
6. **Firewall rules** - Only expose ports 80, 443, and SSH

---

## 🐛 Troubleshooting

### Build Errors

```bash
# Clean and rebuild
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### API Connection Issues

```bash
# Test Todoist API
curl -H "Authorization: Bearer $TODOIST_API_TOKEN" \
  https://api.todoist.com/api/v1/tasks

# Test Fireflies API
curl -H "Authorization: Bearer $FIREFLIES_API_KEY" \
  -X POST https://api.fireflies.ai/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ transcripts(limit: 1) { id title } }"}'
```

### Service Won't Start

```bash
# Check for port conflicts
sudo netstat -tlnp | grep 3000

# View detailed logs
sudo journalctl -u mission-control -n 100 --no-pager

# Check file permissions
ls -la ~/.openclaw/workspace/STARTUPS/mission-control/
```

### SSL Certificate Issues

```bash
# Check certificate
sudo certbot certificates

# Renew manually
sudo certbot renew

# Check Nginx config
sudo nginx -t
```

---

## 📝 Development Guidelines

### Code Style
- TypeScript for all new code
- Functional React components with hooks
- Tailwind CSS for styling
- Lucide React for icons

### Adding New Features

1. **New API Integration:**
   - Create route in `src/app/api/[name]/route.ts`
   - Add environment variable to `.env.local`
   - Create hook in `src/app/hooks/`
   - Add component in `src/app/components/`

2. **New Dashboard Widget:**
   - Add to `src/app/page.tsx` dashboard overview
   - Create component in `src/app/components/`
   - Update stats calculation

3. **UI Components:**
   - Use Tailwind for styling
   - Follow existing color scheme (slate/indigo/emerald)
   - Ensure responsive design

---

## 🎯 Roadmap

- [ ] Google Calendar integration
- [ ] Gmail integration
- [ ] WebSocket real-time updates (replace polling)
- [ ] Mobile-responsive improvements
- [ ] Dark/light mode toggle
- [ ] Custom widget system
- [ ] Data export functionality
- [ ] Multi-user support

---

## 🤝 Contributing

This is a personal project, but suggestions and improvements are welcome!

---

## 📄 License

Private - For personal use only.

---

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Todoist API](https://developer.todoist.com/)
- [Fireflies API](https://docs.fireflies.ai/)
- [Let's Encrypt](https://letsencrypt.org/)

---

**Built with ❤️ by Olivia for Robbie**

For questions or issues, check the detailed guides:
- [Systemd Setup](SYSTEMD_SETUP.md)
- [HTTPS Setup](HTTPS_SETUP.md)

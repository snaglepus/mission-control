# HTTPS/SSL Setup Guide for Mission Control

This guide sets up HTTPS with free Let's Encrypt SSL certificates using Nginx as a reverse proxy.

---

## 📝 Prerequisites

1. **A domain name** pointing to your VPS IP address
   - Example: `mission.robjam.es` or `dashboard.yourdomain.com`
   - DNS A record should point to your VPS IP

2. **Ports 80 and 443 open** in your firewall
   - HTTP (port 80) - for initial setup and redirects
   - HTTPS (port 443) - for secure access

3. **Mission Control running** on port 3000

---

## 🚀 Quick Setup (Automated)

### Option 1: Interactive Setup
```bash
cd ~/.openclaw/workspace/STARTUPS/mission-control
sudo ./setup-https.sh
```
This will prompt you for your domain and handle everything automatically.

### Option 2: One-liner (if you know your domain)
```bash
cd ~/.openclaw/workspace/STARTUPS/mission-control
sudo ./quick-https.sh mission.yourdomain.com
```

---

## 🛠️ Manual Setup (Step by Step)

If you prefer to do it manually or need to troubleshoot:

### Step 1: Install Nginx and Certbot
```bash
sudo apt-get update
sudo apt-get install -y nginx certbot python3-certbot-nginx
```

### Step 2: Create Nginx Configuration

Create `/etc/nginx/sites-available/mission-control`:

```nginx
server {
    listen 80;
    server_name mission.yourdomain.com;  # Replace with your domain

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/mission-control /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### Step 3: Obtain SSL Certificate
```bash
sudo certbot --nginx -d mission.yourdomain.com
```

Follow the prompts. Choose option 2 (redirect HTTP to HTTPS) when asked.

### Step 4: Secure Mission Control (Bind to localhost)

Edit `/etc/systemd/system/mission-control.service` and add:
```
Environment=HOSTNAME=127.0.0.1
```

Reload and restart:
```bash
sudo systemctl daemon-reload
sudo systemctl restart mission-control
```

---

## 🔒 Security Benefits

With this setup:
- ✅ All traffic encrypted with TLS 1.3
- ✅ HTTP automatically redirects to HTTPS
- ✅ Mission Control not directly exposed to internet (only via Nginx)
- ✅ Nginx handles SSL termination efficiently
- ✅ Free certificates auto-renew every 60 days

---

## 🧪 Testing

### Test HTTP to HTTPS redirect
```bash
curl -I http://mission.yourdomain.com
```
Should show `301 Moved Permanently` redirecting to HTTPS.

### Test HTTPS connection
```bash
curl -I https://mission.yourdomain.com
```
Should show `200 OK`.

### Check SSL certificate
```bash
echo | openssl s_client -servername mission.yourdomain.com -connect mission.yourdomain.com:443 2>/dev/null | openssl x509 -noout -dates
```

---

## 📊 Management Commands

### Check Nginx status
```bash
sudo systemctl status nginx
sudo nginx -t  # Test configuration
```

### Check SSL certificate status
```bash
sudo certbot certificates
```

### Force certificate renewal (for testing)
```bash
sudo certbot renew --force-renewal
```

### View renewal logs
```bash
sudo journalctl -u certbot.timer
```

### Restart all services
```bash
sudo systemctl restart nginx
sudo systemctl restart mission-control
```

---

## 🔧 Troubleshooting

### "Failed to obtain certificate"
1. Check DNS is pointing to your VPS: `dig mission.yourdomain.com`
2. Check ports 80/443 are open: `sudo ufw status`
3. Check Nginx is running: `sudo systemctl status nginx`

### "502 Bad Gateway"
1. Mission Control not running: `sudo systemctl status mission-control`
2. Wrong port: Check `proxy_pass` in Nginx config
3. Firewall blocking: `sudo ufw allow 3000/tcp`

### "This site can't provide a secure connection"
1. Certificate expired: `sudo certbot renew`
2. Wrong domain in certificate: `sudo certbot certificates`

### Mixed content warnings
If you see "Mixed content" errors in browser console, check that all resources load over HTTPS.

---

## 🔄 Auto-Renewal

Certbot sets up auto-renewal automatically. To verify:
```bash
sudo systemctl status certbot.timer
sudo certbot renew --dry-run
```

---

## 📝 Example Complete Configuration

### /etc/nginx/sites-available/mission-control
```nginx
server {
    listen 80;
    server_name mission.robjam.es;
    return 301 https://$server_name$request_uri;  # Redirect HTTP to HTTPS
}

server {
    listen 443 ssl http2;
    server_name mission.robjam.es;

    # SSL certificates (managed by Certbot)
    ssl_certificate /etc/letsencrypt/live/mission.robjam.es/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mission.robjam.es/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## ✅ Post-Setup Checklist

- [ ] Domain DNS A record points to VPS IP
- [ ] HTTP access works (redirects to HTTPS)
- [ ] HTTPS access works with valid certificate
- [ ] Basic auth still prompts for credentials
- [ ] Todoist data loads correctly
- [ ] Fireflies data loads correctly
- [ ] Auto-renewal is working

---

**Questions?** Check the logs:
```bash
# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Mission Control logs
sudo journalctl -u mission-control -f

# Certbot logs
sudo tail -f /var/log/letsencrypt/letsencrypt.log
```

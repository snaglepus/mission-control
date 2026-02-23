#!/bin/bash

# Mission Control HTTPS/SSL Setup Script
# Sets up Nginx reverse proxy with Let's Encrypt SSL

set -e

echo "🔒 Setting up HTTPS/SSL for Mission Control..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Please run with sudo: sudo ./setup-https.sh"
    exit 1
fi

# Get domain name
read -p "Enter your domain name (e.g., mission.yourdomain.com): " DOMAIN

if [ -z "$DOMAIN" ]; then
    echo "❌ Domain name is required"
    exit 1
fi

echo ""
echo "📋 Configuration:"
echo "  Domain: $DOMAIN"
echo "  Backend: http://localhost:3000"
echo ""
read -p "Continue? (y/n): " CONFIRM

if [ "$CONFIRM" != "y" ]; then
    echo "Aborted"
    exit 1
fi

# Update system
echo "📦 Updating package list..."
apt-get update

# Install Nginx
echo "🌐 Installing Nginx..."
apt-get install -y nginx

# Install Certbot
echo "🔐 Installing Certbot..."
apt-get install -y certbot python3-certbot-nginx

# Create Nginx config
echo "⚙️ Creating Nginx configuration..."
cat > /etc/nginx/sites-available/mission-control << EOF
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/mission-control /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test Nginx config
nginx -t

# Reload Nginx
systemctl reload nginx

# Obtain SSL certificate
echo "🔒 Obtaining SSL certificate from Let's Encrypt..."
certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email rob@robjam.es --redirect

# Setup auto-renewal
echo "🔄 Setting up auto-renewal..."
systemctl enable certbot.timer
systemctl start certbot.timer

# Create renewal hook to reload Nginx
cat > /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh << 'EOF'
#!/bin/bash
systemctl reload nginx
EOF
chmod +x /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh

# Update Mission Control to bind to localhost only
echo "🔒 Updating Mission Control to bind to localhost only..."
systemctl stop mission-control 2>/dev/null || true

# Update service to bind to localhost
sed -i 's/Environment=PORT=3000/Environment=PORT=3000\nEnvironment=HOSTNAME=127.0.0.1/' /etc/systemd/system/mission-control.service 2>/dev/null || true
systemctl daemon-reload
systemctl start mission-control 2>/dev/null || true

echo ""
echo "✨ HTTPS Setup Complete!"
echo ""
echo "🌐 Your Mission Control is now available at:"
echo "   https://$DOMAIN"
echo ""
echo "📊 Check status:"
echo "   sudo systemctl status nginx"
echo "   sudo systemctl status mission-control"
echo ""
echo "🔒 SSL Certificate Info:"
echo "   sudo certbot certificates"
echo ""
echo "📝 To renew manually (auto-renewal is enabled):"
echo "   sudo certbot renew"

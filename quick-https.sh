#!/bin/bash

# Quick HTTPS Setup for Mission Control
# Assumes you already have a domain pointing to this server

set -e

DOMAIN=${1:-""}

if [ -z "$DOMAIN" ]; then
    echo "Usage: sudo ./quick-https.sh your-domain.com"
    exit 1
fi

echo "🔒 Quick HTTPS setup for $DOMAIN..."

# Install dependencies
apt-get update
apt-get install -y nginx certbot python3-certbot-nginx

# Create Nginx config
cat > /etc/nginx/sites-available/mission-control << EOF
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://127.0.0.1:3000;
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

ln -sf /etc/nginx/sites-available/mission-control /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Get SSL certificate
certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email rob@robjam.es --redirect

# Enable auto-renewal
systemctl enable certbot.timer
systemctl start certbot.timer

# Reload everything
systemctl reload nginx

echo "✅ HTTPS enabled! Visit: https://$DOMAIN"

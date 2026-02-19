#!/bin/bash

# Configuration
NGINX_CONF="/etc/nginx/sites-available/default"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🌐 Konfiguracja Domeny dla Magic Loop${NC}"
echo "Ten skrypt skonfiguruje Nginx i certyfikat SSL (https) dla Twojej domeny."
echo ""

# 1. Ask for domain
read -p "Podaj nazwę domeny (np. magicloop.pl): " DOMAIN_NAME

if [ -z "$DOMAIN_NAME" ]; then
    echo -e "${RED}Błąd: Nie podano domeny.${NC}"
    exit 1
fi

echo -e "${GREEN}Konfiguruję domenę: $DOMAIN_NAME (oraz www.$DOMAIN_NAME)...${NC}"

# 2. Update Nginx Config
echo "Aktualizuję konfigurację Nginx..."

# Backup existing config
cp $NGINX_CONF "$NGINX_CONF.bak_$(date +%s)"

cat > $NGINX_CONF <<EOF
server {
    listen 80;
    server_name $DOMAIN_NAME www.$DOMAIN_NAME;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Test configuration
nginx -t
if [ $? -ne 0 ]; then
    echo -e "${RED}Błąd konfiguracji Nginx. Przywracam kopię zapasową.${NC}"
    cp "$NGINX_CONF.bak_*" $NGINX_CONF
    exit 1
fi

# Reload Nginx
systemctl reload nginx

# 3. Setup SSL with Certbot
echo -e "${GREEN}Instaluję certyfikat SSL (Let's Encrypt)...${NC}"

# Check if certbot is installed
if ! command -v certbot &> /dev/null; then
    echo "Instaluję certbot..."
    apt-get update
    apt-get install -y certbot python3-certbot-nginx
fi

# Run certbot
certbot --nginx -d $DOMAIN_NAME -d www.$DOMAIN_NAME --non-interactive --agree-tos -m admin@$DOMAIN_NAME --redirect

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Sukces! Twoja strona jest dostępna pod adresem: https://$DOMAIN_NAME${NC}"
else
    echo -e "${RED}❌ Błąd podczas generowania certyfikatu SSL.${NC}"
    echo "Upewnij się, że rekordy DNS (A) wskazują na ten serwer (93.127.214.180)!"
fi

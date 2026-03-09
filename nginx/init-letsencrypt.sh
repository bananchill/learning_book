#!/bin/bash
# Настройка Let's Encrypt для interactive-code.ru
# Хостовый nginx как reverse proxy → Docker-контейнер на порту 3000

set -e

DOMAIN="interactive-code.ru"
EMAIL="maks.maksim010607@yandex.ru"

echo "=== Настройка SSL для $DOMAIN ==="

# 1. Установка certbot
echo "1/5 Установка certbot..."
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# 2. Создаём директорию для certbot challenge
sudo mkdir -p /var/www/certbot

# 3. Копируем конфиг nginx (без SSL-блока для первичного получения)
echo "2/5 Настройка nginx..."
sudo tee /etc/nginx/sites-available/interactive-code.ru > /dev/null <<'NGINX'
server {
    listen 80;
    listen [::]:80;
    server_name interactive-code.ru www.interactive-code.ru;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINX

sudo ln -sf /etc/nginx/sites-available/interactive-code.ru /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# 4. Запускаем Docker-контейнер
echo "3/5 Запуск контейнера..."
docker compose up -d --build

# 5. Получаем сертификат
echo "4/5 Получение сертификата Let's Encrypt..."
sudo certbot --nginx \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  -d "$DOMAIN" \
  -d "www.$DOMAIN"

# 6. Заменяем конфиг на полный (с SSL)
echo "5/5 Применяем финальный конфиг..."
sudo cp "$(dirname "$0")/host-nginx.conf" /etc/nginx/sites-available/interactive-code.ru
sudo nginx -t && sudo systemctl reload nginx

echo ""
echo "=== Готово! ==="
echo "Сайт доступен: https://$DOMAIN"
echo "Автообновление сертификата: sudo certbot renew --dry-run"

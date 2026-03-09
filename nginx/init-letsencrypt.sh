#!/bin/bash
# Первичное получение Let's Encrypt сертификата для interactive-code.ru
# Запустить один раз на сервере перед основным docker compose up

set -e

DOMAIN="interactive-code.ru"
EMAIL="maks.maksim010607@yandex.ru"

echo "=== Получение SSL-сертификата для $DOMAIN ==="

# 1. Запускаем nginx с временным self-signed сертификатом (для certbot challenge)
echo "1/4 Создаём временный сертификат..."
docker compose up -d book

# Ждём пока nginx поднимется
sleep 5

# Создаём временные сертификаты чтобы nginx мог стартовать
docker compose exec book sh -c "
  mkdir -p /etc/letsencrypt/live/$DOMAIN
  openssl req -x509 -nodes -days 1 -newkey rsa:2048 \
    -keyout /etc/letsencrypt/live/$DOMAIN/privkey.pem \
    -out /etc/letsencrypt/live/$DOMAIN/fullchain.pem \
    -subj '/CN=localhost'
"

# Перезапускаем nginx с временным сертификатом
docker compose exec book nginx -s reload
sleep 2

# 2. Получаем настоящий сертификат
echo "2/4 Запрашиваем сертификат у Let's Encrypt..."
docker compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  -d "$DOMAIN" \
  -d "www.$DOMAIN"

# 3. Перезапускаем nginx с настоящим сертификатом
echo "3/4 Перезапускаем nginx..."
docker compose exec book nginx -s reload

# 4. Запускаем certbot для автообновления
echo "4/4 Запускаем автообновление..."
docker compose up -d certbot

echo ""
echo "=== Готово! ==="
echo "Сайт доступен: https://$DOMAIN"
echo "Сертификат будет автоматически обновляться каждые 12 часов."

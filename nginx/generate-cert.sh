#!/bin/bash
# Генерация self-signed сертификата для HTTPS
# Запустить один раз перед первым docker compose up

set -e

CERT_DIR="$(dirname "$0")/certs"
mkdir -p "$CERT_DIR"

if [ -f "$CERT_DIR/selfsigned.crt" ] && [ -f "$CERT_DIR/selfsigned.key" ]; then
    echo "Сертификат уже существует в $CERT_DIR"
    echo "Удалите файлы и запустите заново для перегенерации."
    exit 0
fi

echo "Генерация self-signed сертификата..."

openssl req -x509 -nodes -days 365 \
    -newkey rsa:2048 \
    -keyout "$CERT_DIR/selfsigned.key" \
    -out "$CERT_DIR/selfsigned.crt" \
    -subj "/C=RU/ST=Moscow/L=Moscow/O=LearningBook/CN=82.202.140.205" \
    -addext "subjectAltName=IP:82.202.140.205"

echo "Сертификат создан:"
echo "  $CERT_DIR/selfsigned.crt"
echo "  $CERT_DIR/selfsigned.key"
echo ""
echo "Теперь можно запускать: docker compose up -d"

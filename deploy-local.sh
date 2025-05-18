#!/usr/bin/env bash
set -e

# Basit local deploy betiği – GoDaddy DNS güncellemesi ve Docker Compose ile siteyi ayağa kaldırır

# Gereksinimler: curl, docker, docker-compose
for cmd in curl docker docker-compose; do
  if ! command -v $cmd >/dev/null 2>&1; then
    echo "$cmd bulunamadı. Lütfen yükleyin ve tekrar deneyin."
    exit 1
  fi
done

DOMAIN="abantari.com"
WWW="www.${DOMAIN}"

echo "GoDaddy API Key (Production):"
read -r GD_KEY
echo "GoDaddy API Secret:"
read -r GD_SECRET
echo "Let's Encrypt e-posta adresiniz:"
read -r LE_EMAIL

echo "
1) Genel IP adresi alınıyor..."
IP=$(curl -s https://api.ipify.org)
echo "   IP = $IP"

echo "
2) GoDaddy DNS kayıtları güncelleniyor..."
API_BASE="https://api.godaddy.com/v1/domains/${DOMAIN}/records"

curl -s -X PUT "${API_BASE}/A/@" \
  -H "Authorization: sso-key ${GD_KEY}:${GD_SECRET}" \
  -H "Content-Type: application/json" \
  -d "[{\"data\":\"${IP}\",\"ttl\":600}]"

curl -s -X PUT "${API_BASE}/CNAME/www" \
  -H "Authorization: sso-key ${GD_KEY}:${GD_SECRET}" \
  -H "Content-Type: application/json" \
  -d "[{\"data\":\"${DOMAIN}\",\"ttl\":600}]"

echo "   DNS güncellendi."

echo "
3) Docker Compose ortam dosyası (.env) oluşturuluyor..."
mkdir -p my-site
cat > my-site/.env <<EOF
VIRTUAL_HOST=${DOMAIN},${WWW}
LETSENCRYPT_HOST=${DOMAIN},${WWW}
LETSENCRYPT_EMAIL=${LE_EMAIL}
EOF
echo "\n3.1) Sistem üzerinde çalışan nginx süreçlerini durduruyor..."
sudo pkill -9 nginx || true
sudo killall -9 nginx || true
echo "\n3.2) Port 80/443'ü kullanan eski Docker container'lerini durduruyorum..."
docker ps --filter publish=80 --filter publish=443 --format "{{.ID}}" | xargs -r docker rm -f

echo "
4) Docker Compose ile servisler başlatılıyor..."
cd my-site
docker-compose up -d

echo "
Deploy tamamlandı.
Router veya NAT üzerinde 80 ve 443 portlarının bu makineye yönlendirildiğinden emin olun.
Artık https://${DOMAIN} adresine erişebilirsiniz."
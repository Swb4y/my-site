#!/usr/bin/env bash
# deploy.sh - Otomatik olarak Docker, Docker Compose ve ngrok kurarak
# Laravel e-ticaret projesini konteynerlerde ayağa kaldırır ve ngrok ile yayınlar.

set -e

echo "1. Sistem paketlerini güncelliyorum..."
sudo apt update && sudo apt upgrade -y

echo "2. Docker ve Docker Compose yükleniyor..."
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common unzip
curl -fsSL https://download.docker.com/linux/$(. /etc/os-release && echo "$ID")/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/$(. /etc/os-release && echo "$ID") $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose
sudo usermod -aG docker ${USER}

echo "3. ngrok kuruluyor..."
NGROK_ZIP="ngrok-stable-linux-amd64.zip"
mkdir -p $HOME/bin
curl -s https://bin.equinox.io/c/4VmDzA7iaHb/${NGROK_ZIP} -o /tmp/${NGROK_ZIP}
unzip -o /tmp/${NGROK_ZIP} -d $HOME/bin
export PATH="$HOME/bin:$PATH"

echo "4. Proje dizininden Docker Compose başlatılıyor..."
docker-compose build
docker-compose up -d

echo "5. Laravel artisan setup uygulansın (başlangıç için):"
docker-compose exec app composer install --no-interaction --prefer-dist
docker-compose exec app php artisan key:generate
docker-compose exec app php artisan migrate --force

echo "6. Ngrok authtoken ayarlayınız (eğer zaten ayarlı değilse):"
read -p "Ngrok Authtoken (Dashboard->Auth->Your Authtoken): " NGROK_TOKEN
ngrok authtoken "$NGROK_TOKEN"

echo "7. Ngrok ile port 8000 tünelleniyor..."
nohup ngrok http 8000 &>/dev/null &

echo "Kurulum tamamlandı. Ngrok URL'sini almak için:"
echo "    ngrok tunnels"
echo "veya" 
echo "    ngrok http 8000" 
echo "komutlarını kullanabilirsiniz."

echo "Önemli: Bu betiği çalıştırdıktan sonra terminali kapatmayın; Docker ve ngrok arka planda çalışıyor."
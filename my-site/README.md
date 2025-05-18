# Benim Sitem

Modern ve özelleştirilebilir statik web sitesi şablonu; istediğiniz custom domain ve ücretsiz SSL ile otomatik olarak entegre olur.

## Özellikler
- Ana Sayfa, Hakkımızda ve İletişim sayfaları
- Docker + Nginx Proxy + Let's Encrypt ile kolay dağıtım
- Ortam değişkenleri ile domain ve e-posta konfigürasyonu

## Gereksinimler
- Bir Linux sunucusu (VPS)
- Docker ve Docker Compose

## Kurulum
1. Sunucunuzda Docker ve Docker Compose yüklü olmalı.
2. Repoyu klonlayın ve `my-site` dizinine girin:
   ```bash
   git clone <repo-url>
   cd my-site
   ```
3. `.env.example` dosyasını `.env` olarak kopyalayın ve düzenleyin:
   ```bash
   cp .env.example .env
   nano .env
   ```
   - `VIRTUAL_HOST` ve `LETSENCRYPT_HOST` değerlerine `yourdomain.com,www.yourdomain.com` yerine kendi domaininizi yazın.
   - `LETSENCRYPT_EMAIL` değerine e-posta adresinizi yazın.
4. Uygulamayı başlatın:
   ```bash
   docker-compose up -d
   ```
5. GoDaddy DNS ayarlarına gidin ve aşağıdaki kayıtları ekleyin:
   - A kaydı (`@`): Sunucu IP adresiniz
   - CNAME kaydı (`www`): `@`
6. Birkaç dakika bekledikten sonra `https://yourdomain.com` adresine gidin.

SSL sertifikası Let's Encrypt tarafından otomatik olarak alınır ve yenilenir.
 
## Geliştirme

Bireysel geliştirme ortamınızda çalışmak için:
```bash
cd my-site
npm install
cp .env.example .env
# ".env" dosyasını gerektiği gibi güncelleyin
npm run lint
npm start
```
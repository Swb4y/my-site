#!/usr/bin/env bash
# setup-domain.sh: Yerel geliştirme için abantari.com domainini /etc/hosts dosyasına ekler.
# Kullanım:
#   sudo chmod +x setup-domain.sh
#   sudo ./setup-domain.sh

set -e

if [ "$EUID" -ne 0 ]; then
  echo "Bu script root olarak çalıştırılmalıdır. Lütfen 'sudo $0' ile tekrar deneyin."
  exit 1
fi

HOSTS_LINE="127.0.0.1 abantari.com www.abantari.com"

echo "/etc/hosts dosyası kontrol ediliyor..."
if grep -q "abantari.com" /etc/hosts; then
  echo "/etc/hosts zaten abantari.com girdisi içeriyor."
else
  echo "$HOSTS_LINE" >> /etc/hosts
  echo "abantari.com ve www.abantari.com yönlendirmesi /etc/hosts dosyasına eklendi."
fi
echo "İşlem tamamlandı. Tarayıcınızda http://abantari.com adresini deneyebilirsiniz."
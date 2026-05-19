#!/usr/bin/env bash
# نشر ميزة كلمات مرور بوابة ولي الأمر — تشغيل على السيرفر عبر SSH
# الاستخدام: ./scripts/deploy-production.sh
# يتطلب: mysqldump, composer, php, npm (أو public/build مرفوع مسبقاً من Git)

set -euo pipefail

APP_DIR="${APP_DIR:-$(cd "$(dirname "$0")/.." && pwd)}"
cd "$APP_DIR"

MAINTENANCE_SECRET="${MAINTENANCE_SECRET:-deploy-$(date +%s)}"
DB_NAME="${DB_DATABASE:-}"
DB_USER="${DB_USERNAME:-}"

echo "==> App: $APP_DIR"

if [[ -z "$DB_NAME" ]] && [[ -f .env ]]; then
  DB_NAME=$(grep -E '^DB_DATABASE=' .env | cut -d= -f2- | tr -d '"' | tr -d "'")
  DB_USER=$(grep -E '^DB_USERNAME=' .env | cut -d= -f2- | tr -d '"' | tr -d "'")
fi

if [[ -n "$DB_NAME" ]] && command -v mysqldump &>/dev/null; then
  BACKUP="$HOME/backup-pre-parent-passwords-$(date +%F-%H%M).sql"
  echo "==> Backup: $BACKUP"
  mysqldump -u "${DB_USER:-root}" -p "$DB_NAME" --single-transaction --routines --triggers > "$BACKUP"
  ls -lh "$BACKUP"
else
  echo "==> Skip backup (set DB_DATABASE or run mysqldump manually)"
fi

echo "==> Maintenance mode"
php artisan down --secret="$MAINTENANCE_SECRET"
echo "    Bypass URL: ${APP_URL:-https://mzschool-results.com}/${MAINTENANCE_SECRET}"

echo "==> Git pull"
git fetch origin
git pull --ff-only origin "$(git branch --show-current)"

if ! grep -q '^PARENT_PASSWORD_BCRYPT_ROUNDS=' .env 2>/dev/null; then
  echo "PARENT_PASSWORD_BCRYPT_ROUNDS=8" >> .env
  echo "==> Added PARENT_PASSWORD_BCRYPT_ROUNDS=8 to .env"
fi

echo "==> Composer"
composer install --no-dev --optimize-autoloader

echo "==> Migrate (new migrations only)"
php artisan migrate --force

if command -v npm &>/dev/null && [[ -f package.json ]]; then
  echo "==> NPM build"
  npm ci
  npm run build
else
  echo "==> Skip npm (ensure public/build exists)"
fi

echo "==> Cache"
php artisan route:clear
php artisan config:clear
php artisan view:clear
php artisan cache:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

if command -v systemctl &>/dev/null; then
  sudo systemctl reload php8.3-fpm 2>/dev/null || sudo systemctl reload php-fpm 2>/dev/null || true
  sudo systemctl reload nginx 2>/dev/null || true
fi

php artisan up
echo "==> Deploy complete. Test: /admin (parent portal tab) and /parent login"

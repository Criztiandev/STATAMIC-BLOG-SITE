#!/bin/bash

################################################################################
# Vercel Build Script for Statamic SSG
# Uses yum to install PHP quickly on Amazon Linux 2023
################################################################################

set -e  # Exit on error

echo "🚀 Starting Statamic SSG build process..."

# Install PHP and required extensions (fast install)
echo "📦 Installing PHP..."
yum install -y php php-cli php-mbstring php-xml php-zip php-gd php-curl php-tokenizer php-dom -q

# Verify PHP
php -v || { echo "❌ PHP installation failed"; exit 1; }

# Install Composer
echo "📦 Installing Composer..."
curl -sS https://getcomposer.org/installer | php -- --quiet
chmod +x composer.phar

# Install dependencies
echo "📦 Installing Composer dependencies..."
./composer.phar install --no-dev --optimize-autoloader --prefer-dist --no-interaction --quiet

# Setup environment
echo "⚙️ Setting up environment..."
cp .env.example .env
php artisan key:generate --force --no-interaction

# Prepare directories
mkdir -p storage/app/static
chmod -R 775 storage bootstrap/cache

# Clear caches
echo "🗑️ Clearing caches..."
php please stache:clear
php please stache:warm -n -q

# Generate static site
echo "🔨 Generating static site..."
php please ssg:generate --workers=4

# Verify output
echo "✅ Build completed!"
echo "📂 Output files:"
ls -lh storage/app/static/ | head -10

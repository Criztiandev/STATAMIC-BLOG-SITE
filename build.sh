#!/bin/sh

################################################################################
# Vercel Build Script for Statamic SSG
# This script runs in Vercel's build environment to generate static HTML
################################################################################

echo "Starting Statamic SSG build process..."

# Install PHP 8.2
echo "Installing PHP 8.2..."
yum install -y amazon-linux-extras
amazon-linux-extras enable php8.2
yum clean metadata
yum install -y php82 php82-cli php82-mbstring php82-xml php82-zip php82-gd php82-curl php82-tokenizer

# Verify PHP installation
php -v

# Install Composer
echo "Installing Composer..."
curl -sS https://getcomposer.org/installer -o composer-setup.php
php composer-setup.php
rm composer-setup.php

# Install dependencies
echo "Installing Composer dependencies..."
php composer.phar install --no-dev --optimize-autoloader --prefer-dist

# Generate application key if not set
echo "Generating application key..."
php artisan key:generate --force

# Clear and warm Statamic cache
echo "Warming Statamic cache..."
php please stache:clear
php please stache:warm -n -q

# Clear any existing static files
echo "Clearing old static files..."
php please ssg:clear

# Generate static site
echo "Generating static site..."
php please ssg:generate --workers=4

echo "Build completed successfully!"

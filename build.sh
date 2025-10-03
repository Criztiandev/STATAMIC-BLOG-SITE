#!/bin/bash

################################################################################
# Vercel Build Script for Statamic SSG
# This script runs in Vercel's build environment (Amazon Linux 2023)
################################################################################

set -e  # Exit on error

echo "Starting Statamic SSG build process..."

# Install PHP 8.2 on Amazon Linux 2023
echo "Installing PHP 8.2..."
yum install -y php php-cli php-mbstring php-xml php-zip php-gd php-curl

# Verify PHP installation
echo "PHP version:"
php -v

# Install Composer
echo "Installing Composer..."
curl -sS https://getcomposer.org/installer | php
chmod +x composer.phar

# Install dependencies
echo "Installing Composer dependencies..."
./composer.phar install --no-dev --optimize-autoloader --prefer-dist --no-interaction

# Copy .env.example to .env
echo "Setting up environment..."
cp .env.example .env

# Generate application key
echo "Generating application key..."
php artisan key:generate --force --no-interaction

# Clear and warm Statamic cache
echo "Warming Statamic cache..."
php please stache:clear
php please stache:warm -n -q

# Create output directory if it doesn't exist
mkdir -p storage/app/static

# Clear any existing static files
echo "Clearing old static files..."
php please ssg:clear || echo "No previous static files to clear"

# Generate static site
echo "Generating static site..."
php please ssg:generate --workers=4

# Verify output
echo "Build completed successfully!"
echo "Output directory contents:"
ls -lah storage/app/static/ || echo "Static directory not found!"
find storage/app/static -type f | head -20 || echo "No files found!"

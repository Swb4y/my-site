FROM php:8.1-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
        icu-dev \
        libxml2-dev \
        oniguruma-dev \
        zip \
        unzip \
        git \
        bash \
    && docker-php-ext-install pdo_mysql mbstring intl xml

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Default command
CMD ["php-fpm"]
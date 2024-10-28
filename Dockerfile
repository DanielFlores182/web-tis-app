# Usa una imagen base de PHP
FROM php:8.0-apache

# Instala el controlador de PostgreSQL
RUN apt-get update && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql

# Copia tus archivos PHP al contenedor
COPY . /var/www/html/

# Habilita el módulo de Apache rewrite
RUN a2enmod rewrite

# Suprime el mensaje de advertencia de ServerName
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Exponer el puerto 80
EXPOSE 80

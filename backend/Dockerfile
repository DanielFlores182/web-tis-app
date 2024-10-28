# Usa una imagen base de PHP
FROM php:8.0-apache

# Copia tus archivos PHP al contenedor
COPY . /var/www/html/

# Habilita el módulo de Apache rewrite
RUN a2enmod rewrite

# Exponer el puerto 80
EXPOSE 8081

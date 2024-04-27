# Usa la imagen base php:7.4.33-apache-buster
FROM php:7.4.33-apache-buster

# Exponer el puerto 80 para que sea accesible desde fuera del contenedor
EXPOSE 8080

# Comando por defecto para iniciar Apache cuando el contenedor se inicia
CMD ["apache2-foreground"]
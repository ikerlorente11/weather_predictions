# Usamos Node LTS
FROM node:20

# Creamos el directorio de la app
WORKDIR /app

# Instalamos create-vite globalmente
RUN npm install -g create-vite

# Copiamos el entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Exponemos puerto de desarrollo
EXPOSE 5173

ENTRYPOINT ["/entrypoint.sh"]

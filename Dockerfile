# Etapa 1: Build
FROM node:20-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . . 
# Aquí Vite leerá el .env que ya no está ignorado
RUN npm run build

# Etapa 2: Producción
FROM nginx:stable-alpine
# Copiamos la config de ruteo para evitar el error 404
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
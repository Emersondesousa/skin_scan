# Stage 1: Build
FROM node:20-slim AS build

WORKDIR /app

# Argumento da URL do backend (passado no build)
ARG EXPO_PUBLIC_API_URL=""
ENV EXPO_PUBLIC_API_URL=$EXPO_PUBLIC_API_URL

# Copiar package.json e instalar dependencias
COPY package.json package-lock.json ./
RUN npm ci

# Copiar codigo fonte
COPY . .

# Build do Expo Web (gera pasta dist/)
RUN npx expo export --platform web

# Stage 2: Servir com nginx
FROM nginx:alpine

# Copiar configuracao do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar arquivos estaticos do build
COPY --from=build /app/dist /usr/share/nginx/html

# Expor porta
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# Stage 1: Build
FROM node:20-alpine AS build

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Копируем файлы зависимостей
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/book/package.json apps/book/
COPY packages/core/package.json packages/core/
COPY packages/ui/package.json packages/ui/
COPY packages/i18n/package.json packages/i18n/
COPY packages/shared/package.json packages/shared/

# Устанавливаем зависимости
RUN pnpm install --frozen-lockfile

# Копируем исходники
COPY tsconfig.base.json ./
COPY packages/ packages/
COPY apps/book/ apps/book/
COPY content/ content/

# Билдим приложение книги
RUN pnpm --filter @book/app build

# Stage 2: Serve
FROM nginx:alpine

RUN apk add --no-cache openssl

# Копируем собранную статику
COPY --from=build /app/apps/book/dist /usr/share/nginx/html

# Копируем конфиг nginx
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Генерируем self-signed сертификат при сборке
RUN mkdir -p /etc/nginx/certs && \
    openssl req -x509 -nodes -days 365 \
      -newkey rsa:2048 \
      -keyout /etc/nginx/certs/selfsigned.key \
      -out /etc/nginx/certs/selfsigned.crt \
      -subj "/C=RU/ST=Moscow/L=Moscow/O=LearningBook/CN=82.202.140.205" \
      -addext "subjectAltName=IP:82.202.140.205"

EXPOSE 5888

CMD ["nginx", "-g", "daemon off;"]

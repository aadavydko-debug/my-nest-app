# Этап 1: Сборка приложения
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Этап 2: Продакшн-образ (меньше размер)
FROM node:20-alpine

WORKDIR /app

# Копируем зависимости из builder
COPY --from=builder /app/node_modules ./node_modules

# Копируем скомпилированный код
COPY --from=builder /app/dist ./dist

# Копируем package.json
COPY --from=builder /app/package*.json ./

# Открываем порт
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "run", "start:prod"]
# Базовый образ nginx
FROM nginx:alpine

# Удаляем стандартный контент nginx
RUN rm -rf /usr/share/nginx/html/*

# Копируем public и src в контейнер
COPY public /usr/share/nginx/html/public
COPY src /usr/share/nginx/html/src

# Копируем конфиг nginx
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Экспонируем порт
EXPOSE 3000

# Запуск nginx в фоновом режиме
CMD ["nginx", "-g", "daemon off;"]

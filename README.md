# Smart Dashboard

Smart Dashboard - прогрессивное веб-приложение (PWA), предназначенное для управления личными задачами, заметками, профилем и отслеживания прогресса. Приложение разработано с использованием современных веб-технологий и поддерживает оффлайн-режим благодаря service worker.

## Функции

- **Задачи (Tasks)**: Управление списком задач с возможностью добавления, редактирования и удаления.
- **Заметки (Notes)**: Создание и организация заметок.
- **Профиль (Profile)**: Управление пользовательским профилем.
- **Настройки (Settings)**: Конфигурация приложения.
- **Трекер (Tracker)**: Отслеживание прогресса и лидерборд.
- **Оффлайн-режим**: Приложение работает без интернета благодаря service worker.
- **PWA**: Установка на устройство как нативное приложение.

## Технологии

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Сервер**: Nginx
- **Контейнеризация**: Docker, Docker Compose
- **PWA**: Service Worker, Web App Manifest

## Установка и запуск

### Предварительные требования

- Docker
- Docker Compose

### Запуск с помощью Docker Compose

1. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/qwertynya228/smart-dashboard.git
   cd smart-dashboard
   ```

2. Запустите приложение:
   ```bash
   docker-compose up --build
   ```

3. Откройте браузер и перейдите по адресу: `http://localhost:3000`

### Остановка

```bash
docker-compose down
```

## Структура проекта

```
smart-dashboard/
├── docker/
│   └── Dockerfile          # Dockerfile для сборки образа
├── nginx/
│   └── nginx.conf          # Конфигурация Nginx
├── public/
│   ├── index.html          # Главная страница
│   ├── manifest.json       # Web App Manifest для PWA
│   ├── offline.html        # Страница для оффлайн-режима
│   └── icons/              # Иконки для PWA
├── src/
│   ├── main.js             # Точка входа приложения
│   ├── serviceWorker.js    # Service Worker для оффлайн-режима
│   ├── core/               # Ядро приложения
│   │   ├── authService.js
│   │   ├── cacheService.js
│   │   ├── dataService.js
│   │   ├── notifications.js
│   │   ├── router.js
│   │   └── uiContainer.js
│   ├── modules/            # Модули приложения
│   │   ├── notes/          # Модуль заметок
│   │   ├── profile/        # Модуль профиля
│   │   ├── settings/       # Модуль настроек
│   │   ├── tasks/          # Модуль задач
│   │   └── tracker/        # Модуль трекера
│   ├── styles/             # Стили
│   │   ├── main.css
│   │   ├── reset.css
│   │   └── variables.css
│   └── utils/              # Утилиты
│       ├── constants.js
│       ├── helpers.js
│       └── storage.js
├── docker-compose.yml      # Конфигурация Docker Compose
├── package.json            # (Пустой, для будущих расширений)
└── README.md               # Этот файл
```

## Разработка

Для разработки можно редактировать файлы в `src/` и `public/`. Изменения будут автоматически отражены благодаря volume mapping в Docker Compose.

## Лицензия

Этот проект является открытым исходным кодом. Пожалуйста, ознакомьтесь с лицензией для получения дополнительной информации.
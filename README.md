<div align="center">

# 🦸 Marvel Character Explorer

React-приложение для поиска персонажей Marvel и просмотра их биографий и характеристик.

[![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=111)](https://react.dev/) [![Vite](https://img.shields.io/badge/Vite-646cff?logo=vite&logoColor=fff)](https://vite.dev/) [![Demo](https://img.shields.io/badge/demo-GitHub%20Pages-222?logo=github)](https://goldlexx.github.io/marvel/)

</div>

## Возможности

- подборка персонажей с фильтром `Marvel Comics`;
- поиск через SuperHero API;
- карточка с биографией и power stats;
- Demo Mode как резервный вариант.

## Демонстрация

[Открыть Marvel Character Explorer](https://goldlexx.github.io/marvel/)

## Архитектура

Frontend обращается к отдельному Cloudflare Worker, который ограничивает запросы к SuperHero API и добавляет CORS для GitHub Pages.

## Установка и запуск

```bash
npm ci
npm run dev
```

Production-сборка: `npm run build`.

## Технологии

React, Vite, Sass, SuperHero API, Cloudflare Workers.

## Лицензия

Лицензия в репозитории не указана.

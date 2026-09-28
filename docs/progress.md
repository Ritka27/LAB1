# Прогресс

## ЛР 1: старт проекта на React и TypeScript

Создан проект React + TypeScript + Vite в папке `frontend`, заменён стартовый экран на «Учебный менеджер», настроен Git и отправлен репозиторий на GitHub.

### Проверка

1. `cd frontend`, `npm ci`, `npm run dev`: открывается экран с названием и заглушкой списка.
2. Временно `appTitle = 123`, `npm run build`: TypeScript выдаёт ошибку.
3. Исправление на строку, `npm run build`: сборка проходит.
4. `npm run preview`: готовая сборка открывается в браузере.
5. Клонирование в `course-app-check`, `npm ci`, `npm run build`: проект запускается из чистой копии.
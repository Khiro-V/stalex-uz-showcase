# StankoGroup - Каталог станков

Веб-приложение для каталога промышленного оборудования с админ-панелью.

## Технологии

- **Frontend**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS, shadcn/ui, Radix UI
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Routing**: React Router
- **State**: TanStack Query

## Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка Supabase

#### 2.1 Создайте проект в Supabase
1. Перейдите на [supabase.com](https://supabase.com)
2. Создайте новый проект
3. Получите URL и anon key из Settings → API

#### 2.2 Настройте переменные окружения
Скопируйте `.env.example` в `.env`:
```bash
cp .env.example .env
```

Заполните значения в `.env`:
```env
VITE_SUPABASE_URL=your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

#### 2.3 Выполните миграцию базы данных
1. Откройте SQL Editor в Supabase: [Dashboard → SQL Editor](https://supabase.com/dashboard/project/_/sql/new)
2. Скопируйте и выполните SQL-скрипт из миграции (создание таблиц, RLS политик, триггеров)

#### 2.4 Настройте Storage
Storage bucket `products` создается автоматически миграцией.

#### 2.5 Настройте админов
В SQL Editor обновите функцию `is_admin()`, заменив placeholder email'ы на реальные:

```sql
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.jwt() ->> 'email' IN (
    'your-admin@example.com',
    'another-admin@example.com'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
```

#### 2.6 Создайте админских пользователей
1. Перейдите в Authentication → Users
2. Создайте пользователей с email'ами, указанными в `is_admin()`
3. Используйте эти данные для входа в `/auth`

### 3. Запуск приложения

```bash
npm run dev
```

Приложение будет доступно на `http://localhost:5173`

### 4. Сборка для продакшена

```bash
npm run build
```

Готовые файлы будут в папке `dist/`

## Структура проекта

```
src/
├── components/
│   ├── admin/          # Компоненты админки
│   └── ui/             # shadcn/ui компоненты
├── hooks/              # React хуки
├── integrations/       # Supabase клиент
├── pages/
│   ├── admin/          # Страницы админки
│   ├── Auth.tsx        # Страница входа
│   └── ...             # Публичные страницы
└── lib/                # Утилиты
```

## Админ-панель

### Вход
1. Перейдите на `/auth`
2. Используйте email и пароль админского аккаунта
3. После входа вы будете перенаправлены на `/admin`

### Функционал
- **Dashboard**: Статистика по товарам и категориям
- **Товары**: 
  - Список всех товаров с поиском
  - Добавление/редактирование товара
  - Загрузка изображений в Supabase Storage
  - Управление характеристиками (спецификациями)
  - Публикация/снятие с публикации
- **Категории**:
  - Список категорий
  - Добавление/редактирование категории

## База данных

### Таблицы
- `categories` - Категории товаров
- `products` - Товары с характеристиками и изображениями

### RLS (Row Level Security)
- Публичный доступ: только опубликованные товары
- Админский доступ: все операции (через функцию `is_admin()`)

### Storage
- Bucket: `products` (public)
- RLS: только админы могут загружать/удалять

## Контакты

- Email: info@stankogroup.uz
- Телефон: +998 97 433-51-15
- Адрес: Тошкент шахар, Уста Ширин кўчаси, 116 уй

## Источник данных

Каталог, фото и характеристики взяты с [stalex.ru](https://stalex.ru)

---

## Lovable Project

**URL**: https://lovable.dev/projects/54490c06-0c95-4a2e-ae47-aeb7246850cc

### Editing Options
- Use [Lovable](https://lovable.dev/projects/54490c06-0c95-4a2e-ae47-aeb7246850cc) for AI-assisted development
- Clone and work locally with your preferred IDE
- Edit directly in GitHub or use GitHub Codespaces

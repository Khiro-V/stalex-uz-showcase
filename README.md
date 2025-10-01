# STG CORP - Официальный поставщик STALEX в Узбекистане

Интернет-магазин промышленного оборудования STALEX с админ-панелью и интеграцией Supabase.

## Технологии

- **Frontend**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS, shadcn/ui, Radix UI
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Routing**: React Router v6

## Быстрый старт

```bash
npm install
npm run dev
```

## Настройка Supabase

Проект уже подключен к Supabase (`lewbbwnukuoydkjrrpem`).

### Storage buckets (уже созданы):
- `products` - изображения товаров
- `news` - обложки новостей

### Админы
Обновите email в функции `is_admin()` в SQL Editor:
```sql
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.jwt() ->> 'email' IN (
    'ot@stankogroup.uz',
    'khirov1999@gmail.uz'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
```

## Админ-панель (`/admin`)

### Доступ
1. Перейти на `/auth`
2. Войти с email из списка админов

### Разделы

**Товары** - список, создание, редактирование, загрузка изображений  
**Категории** - управление категориями товаров  
**Новости** - управление новостями и статьями

### Работа с новостями

#### Создание:
1. `/admin/news` → "Создать новость"
2. Заполнить:
   - Title (обязательно)
   - Slug (генерируется автоматически)
   - Excerpt (краткое описание)
   - Content (Markdown)
   - Tags (через запятую)
   - Cover (загрузить обложку)
   - Published (переключатель публикации)
3. Сохранить

#### Markdown синтаксис:
```markdown
# Заголовок 1
## Заголовок 2
**Жирный** *Курсив*
[Ссылка](url)
```

#### Теги:
- Используются для фильтрации в `/news`
- Похожие новости подбираются по тегам

## Публичные страницы

- `/` - Главная (витрина, новости)
- `/catalog` - Категории товаров
- `/catalog/:slug` - Товары категории
- `/product/:slug` - Страница товара
- `/news` - Лента новостей (поиск, фильтр по тегам, пагинация)
- `/news/:slug` - Страница новости (Markdown → HTML)

## Контакты

- Email: info@stankogroup.uz
- Телефон: +998 97 433-51-15
- Адрес: Тошкент шахар, Уста Ширин кўчаси, 116 уй

---

## Lovable Project

**URL**: https://lovable.dev/projects/54490c06-0c95-4a2e-ae47-aeb7246850cc

### Editing Options
- Use [Lovable](https://lovable.dev/projects/54490c06-0c95-4a2e-ae47-aeb7246850cc) for AI-assisted development
- Clone and work locally with your preferred IDE
- Edit directly in GitHub or use GitHub Codespaces

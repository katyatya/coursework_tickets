# Инструкция по установке и запуску Python FastAPI сервера

## Предварительные требования

1. Python 3.8 или выше
2. PostgreSQL база данных
3. pip (менеджер пакетов Python)

## Установка

### 1. Установка зависимостей

```bash
cd /path/to/tickets_kursach/server
pip install -r requirements.txt
```

### 2. Настройка базы данных

Создайте файл `.env` в папке server со следующим содержимым:

```env
POSTGRES_URL=postgresql://username:password@localhost:5432/tickets_db
SECRET_KEY=secret123
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Замените `username`, `password` и `tickets_db` на ваши реальные данные для подключения к PostgreSQL.

### 3. Создание базы данных

Убедитесь, что PostgreSQL запущен и создайте базу данных:

```sql
CREATE DATABASE tickets_db;
```

### 4. Инициализация базы данных

Запустите скрипт для создания таблиц и заполнения тестовыми данными:

```bash
python seed.py
```

### 5. (Опционально) Настройка миграций Alembic

Если вы хотите использовать миграции Alembic:

```bash
python init_alembic.py
python -m alembic revision --autogenerate -m "Initial migration"
python -m alembic upgrade head
```

## Запуск сервера

### Способ 1: Через run.py

```bash
python run.py
```

### Способ 2: Через uvicorn напрямую

```bash
uvicorn main:app --host 0.0.0.0 --port 44444 --reload
```

### Способ 3: В production режиме

```bash
uvicorn main:app --host 0.0.0.0 --port 44444 --workers 4
```

## Проверка работы

После запуска сервера:

1. Откройте браузер и перейдите по адресу: `http://localhost:44444`
2. Для просмотра документации API: `http://localhost:44444/docs`
3. Для интерактивной документации: `http://localhost:44444/redoc`

## API Endpoints

### Аутентификация
- `POST /auth/register` - Регистрация пользователя
- `POST /auth/login` - Вход в систему  
- `GET /auth/me` - Получение информации о текущем пользователе

### Билеты
- `GET /my-tickets` - Получение билетов текущего пользователя
- `POST /posts` - Бронирование билета
- `DELETE /posts` - Отмена бронирования билета

### События/Посты
- `GET /posts` - Получение всех событий
- `GET /posts/{id}` - Получение конкретного события
- `GET /tags` - Получение популярных тегов
- `GET /tags/{name}` - Получение событий по тегу

### Файлы
- `POST /upload` - Загрузка файла

## Структура проекта

```
server/
├── main.py              # Основной файл FastAPI приложения
├── models.py            # SQLAlchemy модели
├── schemas.py           # Pydantic схемы
├── crud.py              # CRUD операции
├── auth.py              # Аутентификация
├── database.py          # Настройка БД
├── config.py            # Конфигурация
├── seed.py              # Заполнение БД тестовыми данными
├── run.py               # Скрипт запуска
├── requirements.txt     # Зависимости Python
├── alembic.ini          # Конфигурация Alembic
├── alembic/             # Папка миграций
└── uploads/             # Папка для загруженных файлов
```

## Возможные проблемы

### Ошибка подключения к базе данных
- Убедитесь, что PostgreSQL запущен
- Проверьте правильность URL в файле `.env`
- Убедитесь, что база данных `tickets_db` существует

### Ошибки импорта
- Убедитесь, что все зависимости установлены: `pip install -r requirements.txt`
- Проверьте версию Python (должна быть 3.8+)

### Проблемы с портом
- Если порт 44444 занят, измените его в `run.py` или в команде uvicorn
- Убедитесь, что порт не заблокирован файрволом

## Разработка

Для разработки рекомендуется:

1. Использовать виртуальное окружение:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# или
venv\Scripts\activate     # Windows
```

2. Установить зависимости в виртуальное окружение:
```bash
pip install -r requirements.txt
```

3. Запускать в режиме разработки с автоперезагрузкой:
```bash
uvicorn main:app --reload
```

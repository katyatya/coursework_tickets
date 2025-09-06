# Архитектура сервера Tickets Booking API

## 🏗️ Обзор архитектуры

Проект использует **многослойную архитектуру (Layered Architecture)** с элементами **Clean Architecture** для обеспечения разделения ответственности, тестируемости и масштабируемости.

## 📁 Структура проекта

```
server/
├── app/
│   ├── api/                    # Слой представления (Presentation Layer)
│   │   ├── deps.py            # Зависимости (auth, db)
│   │   └── v1/                # Версия API
│   │       ├── auth.py        # Аутентификация
│   │       ├── posts.py       # Основные endpoints
│   │       └── posts_enhanced.py # Улучшенные endpoints с Services
│   │
│   ├── core/                   # Инфраструктурный слой (Infrastructure Layer)
│   │   ├── config.py          # Конфигурация приложения
│   │   └── security.py        # Безопасность (JWT, хеширование)
│   │
│   ├── models/                 # Слой данных (Data Layer)
│   │   ├── user.py            # Модель пользователя
│   │   └── post.py            # Модель поста/события
│   │
│   ├── schemas/                # Слой передачи данных (DTO Layer)
│   │   ├── user.py            # Схемы пользователя
│   │   ├── post.py            # Схемы поста
│   │   └── auth.py            # Схемы аутентификации
│   │
│   ├── crud/                   # Слой доступа к данным (Data Access Layer)
│   │   ├── base.py            # Базовый CRUD
│   │   ├── user.py            # CRUD для пользователей
│   │   └── post.py            # CRUD для постов
│   │
│   └── services/               # Слой бизнес-логики (Business Logic Layer)
│       └── ticket_service.py  # Сервис для работы с билетами
│
├── scripts/                    # Скрипты
│   └── seed.py                # Заполнение БД
│
├── tests/                      # Тесты
│   └── test_api.py            # Тесты API
│
└── run.py                      # Точка входа
```

## 🔄 Поток данных

```
Frontend Request
       ↓
   API Layer (api/)
       ↓
  Services Layer (services/) ← Бизнес-логика
       ↓
   CRUD Layer (crud/) ← Операции с БД
       ↓
  Models Layer (models/) ← SQLAlchemy модели
       ↓
   Database (PostgreSQL)
       ↓
  Response ← Schemas (schemas/)
```

## 📋 Назначение каждого слоя

### 1. **API Layer** (`app/api/`)
- **Назначение**: Обработка HTTP запросов и ответов
- **Ответственность**: 
  - Валидация входных данных
  - Аутентификация и авторизация
  - Форматирование ответов
  - Обработка ошибок HTTP

```python
@router.post("/posts/")
def book_ticket(booking: TicketBooking, current_user: User = Depends(get_current_user)):
    # Простая логика - делегируем в Services
    result = ticket_service.book_ticket_with_validation(...)
    return result
```

### 2. **Services Layer** (`app/services/`)
- **Назначение**: Бизнес-логика приложения
- **Ответственность**:
  - Сложная бизнес-логика
  - Валидация бизнес-правил
  - Интеграция с внешними сервисами
  - Транзакции и координация

```python
class TicketService:
    def book_ticket_with_validation(self, post_id, user_id, check_availability=True):
        # 1. Проверяем существование поста
        # 2. Проверяем доступность
        # 3. Применяем бизнес-правила
        # 4. Отправляем уведомления
        # 5. Возвращаем результат
```

### 3. **CRUD Layer** (`app/crud/`)
- **Назначение**: Операции с базой данных
- **Ответственность**:
  - Простые CRUD операции
  - Запросы к базе данных
  - Маппинг данных

```python
def book_ticket(db: Session, post_id: int, user_id: int) -> bool:
    # Простая операция с БД
    db.execute(posts_users.insert().values(post_id=post_id, user_id=user_id))
    db.commit()
    return True
```

### 4. **Models Layer** (`app/models/`)
- **Назначение**: Определение структуры данных
- **Ответственность**:
  - SQLAlchemy модели
  - Связи между таблицами
  - Валидация на уровне БД

```python
class Post(Base):
    __tablename__ = "posts"
    post_id = Column(Integer, primary_key=True)
    title = Column(String(70), nullable=False)
    # ...
```

### 5. **Schemas Layer** (`app/schemas/`)
- **Назначение**: Валидация и сериализация данных
- **Ответственность**:
  - Pydantic модели
  - Валидация входных данных
  - Сериализация ответов

```python
class TicketBooking(BaseModel):
    post_id: int

class TicketBookingResponse(BaseModel):
    post_id: int
    user_id: int
```

### 6. **Core Layer** (`app/core/`)
- **Назначение**: Инфраструктурные компоненты
- **Ответственность**:
  - Конфигурация
  - Безопасность
  - Утилиты

## 🤔 Почему папка `services` была пустой?

### **Причины:**

1. **Простота проекта**: Текущий проект - это простой CRUD для бронирования билетов
2. **Логика в API**: Вся логика помещалась в API endpoints
3. **Отсутствие сложной бизнес-логики**: Нет сложных правил, интеграций, транзакций

### **Когда нужны Services:**

- ✅ **Сложная бизнес-логика** (проверки, валидации, правила)
- ✅ **Интеграции** с внешними сервисами (email, платежи, уведомления)
- ✅ **Транзакции** (множественные операции с БД)
- ✅ **Кэширование** и оптимизация
- ✅ **Аналитика** и отчеты

## 🚀 Преимущества архитектуры

### **1. Разделение ответственности**
- Каждый слой имеет четкую ответственность
- Легко понять, где что находится

### **2. Тестируемость**
- Каждый слой можно тестировать независимо
- Легко создавать моки и заглушки

### **3. Масштабируемость**
- Легко добавлять новые функции
- Можно заменить любой слой без влияния на другие

### **4. Переиспользование**
- Services можно использовать в разных API endpoints
- CRUD функции переиспользуются в разных Services

### **5. Поддержка**
- Легко находить и исправлять ошибки
- Четкая структура кода

## 📊 Сравнение подходов

### **Без Services (текущий подход):**
```python
@router.post("/posts/")
def book_ticket(booking: TicketBooking, current_user: User = Depends(get_current_user)):
    # Вся логика в API endpoint
    post = get_post(db, booking.post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    success = book_ticket(db, booking.post_id, current_user.user_id)
    if not success:
        raise HTTPException(status_code=400, detail="Ticket already booked")
    
    return {"message": "success"}
```

### **С Services (улучшенный подход):**
```python
@router.post("/posts/")
def book_ticket(booking: TicketBooking, current_user: User = Depends(get_current_user)):
    # Делегируем в Service
    ticket_service = TicketService(db)
    result = ticket_service.book_ticket_with_validation(
        post_id=booking.post_id,
        user_id=current_user.user_id,
        check_availability=True,
        send_notification=True
    )
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    
    return result
```

## 🎯 Рекомендации

### **Для текущего проекта:**
- Можно оставить простую архитектуру без Services
- Добавлять Services по мере усложнения логики

### **Для будущего развития:**
- Использовать Services для сложной бизнес-логики
- Добавить слой для интеграций с внешними сервисами
- Рассмотреть добавление кэширования (Redis)
- Добавить фоновые задачи (Celery)

## 📚 Дополнительные ресурсы

- [FastAPI Best Practices](https://fastapi.tiangolo.com/tutorial/bigger-applications/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Layered Architecture](https://docs.microsoft.com/en-us/azure/architecture/guide/architecture-styles/layered)

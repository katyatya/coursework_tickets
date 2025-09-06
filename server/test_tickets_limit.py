"""
Тестирование новой функциональности ограничения билетов
"""
import requests
import json

BASE_URL = "http://localhost:44445"

def test_tickets_availability():
    """Тестирование доступности билетов"""
    print("🎫 Тестирование функциональности ограничения билетов")
    print("=" * 60)
    
    # 1. Получаем все посты с информацией о доступности
    print("\n1. Получение всех постов с информацией о доступности билетов:")
    response = requests.get(f"{BASE_URL}/posts/with-availability/")
    if response.status_code == 200:
        posts = response.json()
        for post in posts:
            print(f"📋 {post['title']}")
            print(f"   🎫 Доступно: {post['tickets_available']}/{post['tickets_limit']}")
            print(f"   📊 Забронировано: {post['tickets_booked']}")
            print(f"   ✅ Доступно для бронирования: {'Да' if post['is_available'] else 'Нет'}")
            print()
    else:
        print(f"❌ Ошибка: {response.status_code} - {response.text}")
    
    # 2. Получаем информацию о доступности конкретного поста
    print("\n2. Получение информации о доступности конкретного поста (ID=1):")
    response = requests.get(f"{BASE_URL}/posts/1/availability/")
    if response.status_code == 200:
        availability = response.json()
        print(f"📊 Доступно: {availability['available']}")
        print(f"📋 Забронировано: {availability['booked']}")
        print(f"🎯 Лимит: {availability['limit']}")
        print(f"✅ Доступно: {'Да' if availability['is_available'] else 'Нет'}")
    else:
        print(f"❌ Ошибка: {response.status_code} - {response.text}")
    
    # 3. Тестируем бронирование билетов
    print("\n3. Тестирование бронирования билетов:")
    
    # Сначала регистрируемся
    print("   Регистрация пользователя...")
    register_data = {
        "full_name": "Test User",
        "email": "test@example.com",
        "password": "testpassword123"
    }
    response = requests.post(f"{BASE_URL}/auth/register/", json=register_data)
    if response.status_code == 200:
        user_data = response.json()
        token = user_data["token"]
        print("   ✅ Пользователь зарегистрирован")
        
        # Тестируем бронирование
        headers = {"Authorization": f"Bearer {token}"}
        booking_data = {"post_id": 1}
        
        print("   Бронирование билета...")
        response = requests.post(f"{BASE_URL}/posts/", json=booking_data, headers=headers)
        if response.status_code == 200:
            print("   ✅ Билет успешно забронирован!")
        else:
            print(f"   ❌ Ошибка бронирования: {response.status_code} - {response.text}")
        
        # Проверяем доступность после бронирования
        print("   Проверка доступности после бронирования...")
        response = requests.get(f"{BASE_URL}/posts/1/availability/")
        if response.status_code == 200:
            availability = response.json()
            print(f"   📊 Доступно: {availability['available']}/{availability['limit']}")
        
        # Пытаемся забронировать тот же билет повторно
        print("   Попытка повторного бронирования того же билета...")
        response = requests.post(f"{BASE_URL}/posts/", json=booking_data, headers=headers)
        if response.status_code == 400:
            print("   ✅ Корректно отклонено повторное бронирование")
        else:
            print(f"   ❌ Неожиданный результат: {response.status_code} - {response.text}")
            
    else:
        print(f"   ❌ Ошибка регистрации: {response.status_code} - {response.text}")

if __name__ == "__main__":
    test_tickets_availability()

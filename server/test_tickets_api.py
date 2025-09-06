"""
Простой тест API для проверки отображения билетов
"""
import requests
import json

BASE_URL = "http://localhost:44445"

def test_api_endpoints():
    """Тестирование API endpoints"""
    print("🎫 Тестирование API endpoints для билетов")
    print("=" * 50)
    
    # 1. Тестируем получение всех постов
    print("\n1. Получение всех постов:")
    try:
        response = requests.get(f"{BASE_URL}/posts/")
        if response.status_code == 200:
            posts = response.json()
            if posts:
                post = posts[0]
                print(f"✅ Пост: {post.get('title', 'N/A')}")
                print(f"   🎫 Доступно: {post.get('tickets_available', 'N/A')}/{post.get('tickets_limit', 'N/A')}")
                print(f"   📊 Забронировано: {post.get('tickets_booked', 'N/A')}")
                print(f"   ✅ Доступно: {post.get('is_available', 'N/A')}")
            else:
                print("❌ Нет постов")
        else:
            print(f"❌ Ошибка: {response.status_code}")
    except Exception as e:
        print(f"❌ Ошибка подключения: {e}")
    
    # 2. Тестируем получение конкретного поста
    print("\n2. Получение конкретного поста (ID=1):")
    try:
        response = requests.get(f"{BASE_URL}/posts/1")
        if response.status_code == 200:
            post = response.json()
            print(f"✅ Пост: {post.get('title', 'N/A')}")
            print(f"   🎫 Доступно: {post.get('tickets_available', 'N/A')}/{post.get('tickets_limit', 'N/A')}")
            print(f"   📊 Забронировано: {post.get('tickets_booked', 'N/A')}")
            print(f"   ✅ Доступно: {post.get('is_available', 'N/A')}")
        else:
            print(f"❌ Ошибка: {response.status_code}")
    except Exception as e:
        print(f"❌ Ошибка подключения: {e}")
    
    # 3. Тестируем получение информации о доступности
    print("\n3. Получение информации о доступности (ID=1):")
    try:
        response = requests.get(f"{BASE_URL}/posts/1/availability/")
        if response.status_code == 200:
            availability = response.json()
            print(f"✅ Доступно: {availability.get('available', 'N/A')}")
            print(f"   📋 Забронировано: {availability.get('booked', 'N/A')}")
            print(f"   🎯 Лимит: {availability.get('limit', 'N/A')}")
            print(f"   ✅ Доступно: {availability.get('is_available', 'N/A')}")
        else:
            print(f"❌ Ошибка: {response.status_code}")
    except Exception as e:
        print(f"❌ Ошибка подключения: {e}")

if __name__ == "__main__":
    test_api_endpoints()

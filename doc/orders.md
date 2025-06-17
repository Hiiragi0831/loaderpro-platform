# Заказы
## Список заказов
Возвращает список заказов в запрошенном статусе
### Запрос данных
```js
await fetch("/orders?status=1", {
    method: "GET",
    headers: { 
        Authorization: "Bearer <token>"
    }
})
```
Поиск
```js
await fetch("/orders/search?ordernumber=Z17479110881&user=3&date=04.06.2025", {
  method: "GET",
  headers: { 
    Authorization: "Bearer <token>"
  }
})
```
### Ничего не найдено (status: 404)
### Есть результаты (status: 200)
```json
{
    "page": 0,
    "total_page": 10,
    "total_results": 105,
    "results": [
        {
            "id": 1,
            "num_order": "Z17479110881",
            "status": 1,
            "date_create": "2025-06-06T12:34:56Z",
            "date_pay": "2025-06-06T12:34:56Z",
            "date_delivery": "2025-06-06T12:34:56Z",
            "date_shipment": "2025-06-06T12:34:56Z"
        }
    ]
}
```
___
## Список пользователей
Возвращает список пользователей для поиска заказов (для менеджеров и админов)
### Запрос данных
```js
await fetch("/users", {
    method: "GET",
    headers: { 
        Authorization: "Bearer <token>"
    }
})
```
### Ответ (status: 200)
```json
{
    "user_id": 2,
    "users": [
        {
            "id": 1,
            "username": "Иван Иванов"
        }
    ]
}
```

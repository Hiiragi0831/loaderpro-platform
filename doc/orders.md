Статусы
```
const status = [
    {
        name: "В обработке",
        id: 1
    }, {
        name: "Счет отправлен",
        id: 2
    }, {
        name: "Счет оплачен",
        id: 3
    }, {
        name: "В пути",
        id: 4
    }, {
        name: "Готов к отгрузке",
        id: 5
    }, {
        name: "Отгружен",
        id: 6
    }, {
        name: "Отменен",
        id: 7
    }
]
```
# Методы
## Cтатус
/orders/status - возвращает список заказов в запрошенном статусе
### Запрос данных
```
await fetch("/orders/status?order_status=2", {
    method: "GET",
    headers: { 
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
})
```
### Ничего не найдено
```
code: 200

{
    "status": "success",
    "results": [],
    "total_results": 0,
    "message": "Нет активных заказов"
}
```
### Есть результаты
```
code: 200 
{
    "status": "success",
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
            "date_shipment": "2025-06-06T12:34:56Z",
        }
        ...
    ]
}
```
___
## Поиск
/orders/search - возвращает список заказов входящих в поисковые параметры
### Запрос данных
```
await fetch("/orders/search?ordernumber=Z17479110881&user=3&date=04.06.2025", {
  method: "GET",
  headers: { 
    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
})
```
### Ничего не найдено
```
code: 200

{
    "status": "success",
    "results": [],
    "total_results": 0,
    "message": "По вашему запросу, ничего не найдено"
}
```
### Найдены результаты
```
code: 200
{
    "status": "success",
    "page": 0,
    "total_results": 105,
    "results": [
        {
            "id": 1,
            "num_order": "Z17479110881",
            "status": 1,
            "date_create": "2025-06-06T12:34:56Z",
            "date_pay": "2025-06-06T12:34:56Z",
            "date_delivery": "2025-06-06T12:34:56Z",
            "date_shipment": "2025-06-06T12:34:56Z",
        }
        ...
    ]
}
```
___
## Список пользователей
/orders/users - возвращает список пользователей для поиска заказов (для менеджеров и админов)
### Запрос данных
```
await fetch("/orders/users", {
    method: "GET",
    headers: { 
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
})
```
### Ответ
```
code: 200
{
    "status": "success",
    "user_id": 2,
    "ukey": "A",
    "users": [
        {
            "id": 1,
            "username": "Алексей Привалов"
        },
        ...
    ]
}
```

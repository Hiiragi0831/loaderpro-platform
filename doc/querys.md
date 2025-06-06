# Запросы
## Отправка данных
```
await fetch("/query/new", {
    method: "POST",
    headers: { 
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    body: {
        "brand": "WICKE (B69)",
        "numparts": "323232DFW3",
        "count": 3
    }
})

```
## История запросов
### Запрос данных
```
await fetch("/query/history", {
    method: "get",
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
    "message": "Нет истории запросов"
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
            "user" 23,
            "date_create": "2025-06-06T12:34:56Z",
            "date_valid": "2025-06-06T12:34:56Z",
        }
        ...
    ]
}
```
## Воронка запросов
### Запрос данных
Возвращает данные о первых 10 результатах в каждом статусе
```
await fetch("/query/funnel", {
    method: "get",
    headers: { 
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
})

```
Возвращает данные нужного статуса
```
await fetch("/query/funnel?status=2", {
    method: "get",
    headers: { 
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
})

```
### Поиск запроса
```
await fetch("/query/search?ordernumber=Z17479110881&user=3&date=04.06.2025", {
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
    "message": "Нет запросов"
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
            "user" 23,
            "company": "ООО Рога и копыта"
            "date_create": "2025-06-06T12:34:56Z",
            "total_price": 343242
        }
        ...
    ]
}
```

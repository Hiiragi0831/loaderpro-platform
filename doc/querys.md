# Запросы
## Новый запрос
```js
await fetch("/query", {
    method: "POST",
    headers: { 
        Authorization: "Bearer <token>"
    },
    body: [
      {
        "brand": 5,
        "num_parts": "323232DFW3",
        "count": 3
      },
      {
        "brand": 2,
        "num_parts": "334DFS45",
        "count": 3
      }
    ]
})
```
### Успешно отправлен запрос (status: 200)
## История запросов
### Запрос данных
```js
await fetch("/query/history", {
    method: "GET",
    headers: { 
        Authorization: "Bearer <token>"
    }
})
```
Поиск запроса по истории запросов
```js
await fetch("/query/history/search?brand=632&num_parts=365132&numquery=23244&date=04.06.2025", {
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
            "user": "Иван Иванович",
            "date_create": "2025-06-06T12:34:56Z",
            "date_valid": "2025-06-06T12:34:56Z"
        }
    ]
}
```
## Воронка запросов
### Запрос данных
Возвращает данные о первых 10 результатах в каждом статусе
```js
await fetch("/query/funnel", {
    method: "GET",
    headers: { 
        Authorization: "Bearer <token>"
    }
})

```
Возвращает данные нужного статуса
```js
await fetch("/query/funnel?status=2", {
    method: "GET",
    headers: { 
        Authorization: "Bearer <token>"
    }
})

```
Поиск запроса по воронке
```js
await fetch("/query/funnel/search?ordernumber=Z17479110881&user=38&date=04.06.2025", {
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
            "user": "Иван Иванович",
            "company": "ООО Рога и копыта",
            "date_create": "2025-06-06T12:34:56Z",
            "total_price": 343242
        }
    ]
}
```

# Каталог
## Загрузка каталога
### Запрос
```js
await fetch("/catalog/", {
  method: "GET",
  headers: { 
    Authorization: "Bearer <token>"
  }
})
```
### Ответ (status: 200)
```json
{
    "page": 0,
    "total_results": 105,
    "results": [
        {
            "id": 1,
            "title": "Шплинт LINDE (400) 9395003220",
            "status": 1,
            "price": 2564,
            "quality": 2,
            "image": "/image/134324.jpg"
        }
    ]
}
```
## Поиск
```js
await fetch("/catalog/search?request=72642683", {
  method: "GET",
  headers: { 
    Authorization: "Bearer <token>"
  }
})
```
### Ничего не найдено (status: 404)
### Найдены результаты (status: 200)
```json
{
    "page": 0,
    "total_results": 105,
    "results": [
        {
            "id": 1,
            "title": "Шплинт LINDE (400) 9395003220",
            "status": 1,
            "price": 256,
            "quality": 2,
            "image": "/image/134324.jpg"
        }
    ]
}
```
## Добавить товар
```js
await fetch("/catalog", {
    method: "POST",
    headers: { 
        Authorization: "Bearer <token>"
    },
    body: {
        "productname": "Пружина 4233",
        "brand": "LPM (000)",
        "article": "9395003220",
        "price": 23059,
        "count": 2,
        "quality": 3,
        "deliverytime": 2,
        "measurement": 1,
        "weight": 0.5,
        "comment": "Самая обычная пружина.... титановая если можно, чтобы не ломалась",
        "image": [3, 5, 7] // Общие методы > Загрузка картинок
    }
})
```
## Импортировать товары
```js
await fetch("/catalog/import", {
    method: "POST",
    headers: { 
        Authorization: "Bearer <token>"
    },
    body: {
        "file": "temp/1.xlsx"
    }
})
```
### Ошибка загрузки (status: 400)
### Загрузка завершена (status: 200)

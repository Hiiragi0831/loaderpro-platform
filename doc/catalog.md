# Каталог
## Загрузка каталога
### Запрос
```
await fetch("/catalog/", {
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
    "page": 0,
    "total_results": 105,
    "results": [
        {
            "id": 1,
            "title": "Шплинт LINDE (400) 9395003220",
            "status": 1,
            "price": "256",
            "quality": 2,
            "image": "/image/134324.jpg",
        }
        ...
    ]
}
```
## Поиск
```
await fetch("/catalog/search?request=72642683", {
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
            "title": "Шплинт LINDE (400) 9395003220",
            "status": 1,
            "price": "256",
            "quality": 2,
            "image": "/image/134324.jpg",
        }
        ...
    ]
}
```
## Добавить товар
```
await fetch("/catalog/add", {
    method: "POST",
    headers: { 
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
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
        "image": ['temp/1.jpg', 'temp/2.jpg', 'temp/3.jpg',]
    }
})
```
## Импортировать товары
```
await fetch("/catalog/import", {
    method: "POST",
    headers: { 
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    body: {
        "file": "temp/1.xlsx"
    }
})
```

# Каталог
## Поиск
```
await fetch("/catalog/search?request=72642683", {
  method: "GET",
  headers: { 
    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
})
```
## Добавить товар
```
await fetch("/garage/request", {
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
await fetch("/garage/request", {
    method: "POST",
    headers: { 
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    body: {
        "file": "temp/1.xlsx"
    }
})
```

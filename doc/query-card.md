# Карточка запросы
### Запрос данных
```js
await fetch("/query/{id}", {
    method: "GET",
    headers: { 
        Authorization: "Bearer <token>"
    }
})
```
#### Ошибка (status: 404)
#### Ответ (status: 200)
```json
{
  "language": 1,
  "responsible": "Иван Иванов",
  "budget": 3432,
  "purchase": 23323,
  "additionalaccounts": 32423,
  "delivery": 3423,
  "margin": 20324,
  "products": [323244, 3423423, 44434]
}
```
### Запрос товара
```js
await fetch("/catalog/323244", {
    method: "GET",
    headers: { 
        Authorization: "Bearer <token>"
    }
})
```
#### Ошибка (status: 404)
#### Ответ (status: 200)

```json
{
  "productname": "Колпак защитный системы выпуска",
  "brand": 546,
  "article": "3432",
  "price": 23323,
  "count": 2,
  "quality": 2,
  "deliverytime": 20,
  "measurement": 1,
  "weight": 1.1,
  "comment": "Тут комментарий",
  "images": [
    {
      "id": 1,
      "url": "/image/1.jpg"
    },
    {
      "id": 2,
      "url": "/image/2.jpg"
    },
    {
      "id": 3,
      "url": "/image/3.jpg"
    }
  ]
}
```
### Редактировать товар
```js
await fetch("/catalog/{id}", {
    method: "POST",
    headers: { 
        Authorization: "Bearer <token>"
    },
    body: {
        "productname": "Колпак защитный системы выпуска",
        "brand": 546,
        "article": "3432",
        "price": 23323,
        "count": 2,
        "quality": 2,
        "deliverytime": 20,
        "measurement": 1,
        "weight": 1.1,
        "comment": "Тут комментарий",
        "images": [2,56,63] // Общие методы > Загрузка картинок
    }
})
```
#### Ответ (status: 200)
#### Ошибка (status: 400)
### Добавить товар
```js
await fetch("/catalog", {
    method: "POST",
    headers: {
      Authorization: "Bearer <token>"
    },
    body: {
        "productname": "Пружина 4233",
        "brand": 2,
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
#### Ответ (status: 200)
#### Ошибка (status: 400)

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
#### Ошибка загрузки (status: 400)
#### Загрузка завершена (status: 200)

## Экспортировать товары
```js
await fetch("/query/{id}/export", {
    method: "GET",
    headers: { 
        Authorization: "Bearer <token>"
    },
})
```
Загружается файл через браузер
#### Ошибка (status: 400)
#### Ответ (status: 200)

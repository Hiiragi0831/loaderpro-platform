# API

## [Заказы](doc/orders.md)

## [Запросы](doc/querys.md)

## [Гараж](doc/garage.md)

## [Подбор ЗЧ](doc/parts-selection.md)

## На подумать
- Список пользователей (Ответственных) запрашивать при входе в аккаунт?

## Общие требование

- дата передается в формате ISO 8601
- id передается в формате number

## Общие методы

### Загрузка картинок

```js
const input = document.querySelector('#fileInput')
const button = document.querySelector('button')

async function uploadFile() {
  const formData = new FormData()

  // Прикрепляем файл к запросу
  formData.append('file', input.files[0])

  const res = await fetch('/uploads', {
    method: 'POST',
    body: formData,
  })

  if (res.ok) {
    const json = await response.json()
    console.log('Success:', result)
  }
}
```

### Ошибка загрузки (status: 400)

### Загрузка завершена (status: 200)

```json
{
  "id": 52,
  "url": "http://XXX.XXX/uploaded/dfnhxiq6j/image/upload/v1686082533/al9osj8c5tfifyej2gw8.jpg" // это пример пути
}
```

## Статусы

```js
const status = [
    {
        id: 1,
        name: "В обработке"
    }, {
        id: 2,
        name: "Счет отправлен"
    }, {
        id: 3,
        name: "Счет оплачен"
    }, {
        id: 4,
        name: "В пути"
    }, {
        id: 5,
        name: "Готов к отгрузке"
    }, {
        id: 6,
        name: "Отгружен"
    }, {
        id: 7,
        name: "Отменен"
    }
]
```

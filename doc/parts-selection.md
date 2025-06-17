# Подбор ЗЧ

## Создать транспорт
```js
await fetch("/transport", {
    method: "POST",
    headers: { 
        Authorization: "Bearer <token>"
    },
    body: {
        "transportbrand": "LUDA (RJ3)", // Бренд
        "transportmodel": "RC1", // Модель
        "transportyearproduction": "2025", // Год производства
        "transportprefix": "A", // Префикс
        "transportserialnumber": "32156499DFDS8", // Серийный номер
        "enginebrand": "LUDA (RJ3)", // Бренд двигателя
        "enginemodel": "TD37J", // Модель двигателя
        "enginevoltage": "48V", // Напряжение двигателя
        "enginefueltype": "Дизель", // Типо топлива двигателя
        "engineserialnumber": "32156499DFDS8", // Серийный номер двигателя
        "mastbrand": "LUDA (RJ3)", // Бренд мачты
        "mastmodel": "DW23", // Модель мачты
        "mastheight": 123, // Высота мачты
        "mastserialnumber": "32156499DFDS8", // Серийный номер мачты
        "mastsections": 1, // Количество секций мачты
        "mastcylinders": 1, // Количество цилиндров мачты
        "text": "Крутой и непонятный", // Примечание
        "image": [34, 654, 45] // Общие методы > Загрузка картинок
    }
})
```
### Ответ от сервера (status: 200)
```json
{
    "transporid": 4233
}
```
## Запросить запчасти
```js
await fetch("/transport/request", {
    method: "POST",
    headers: { 
        Authorization: "Bearer <token>"
    },
    body: {
      "transporid": 4233,
      "titleparts": "Пружина",
      "numparts": "9395003220",
      "count": 3,
      "comment": "Ну такая круглая"
    },
})
```
### Ответ от сервера (status: 200)
Нужно ли тут обратный ответ для пользователя в виде номера? Или просто уведомляем что успешно запрошено?

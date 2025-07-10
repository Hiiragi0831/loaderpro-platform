# Подбор ЗЧ

## Создать транспорт
```js
await fetch("/transport", {
    method: "POST",
    headers: { 
        Authorization: "Bearer <token>"
    },
    body: {
        "transport_brand": 3, // Бренд
        "transport_model": "RC1", // Модель
        "transport_year_production": "2025", // Год производства
        "transport_prefix": "A", // Префикс
        "transport_serial_number": "32156499DFDS8", // Серийный номер
        "engine_brand": 3, // Бренд двигателя
        "engine_model": "TD37J", // Модель двигателя
        "engine_voltage": "48V", // Напряжение двигателя
        "engine_fuel_type": "Дизель", // Типо топлива двигателя
        "engine_serial_number": "32156499DFDS8", // Серийный номер двигателя
        "mast_brand": 4, // Бренд мачты
        "mast_model": "DW23", // Модель мачты
        "mast_height": 123, // Высота мачты
        "mast_serial_number": "32156499DFDS8", // Серийный номер мачты
        "mast_sections": 1, // Количество секций мачты
        "mast_cylinders": 1, // Количество цилиндров мачты
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
      "title_parts": "Пружина",
      "num_parts": "9395003220",
      "count": 3,
      "comment": "Ну такая круглая"
    },
})
```
### Ответ от сервера (status: 200)
Нужно ли тут обратный ответ для пользователя в виде номера? Или просто уведомляем что успешно запрошено?

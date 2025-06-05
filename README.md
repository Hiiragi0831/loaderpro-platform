# Документация

## Заказы

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
Пути

/orders/status - возвращает список заказов в запрошенном статусе

```
code: 200
{
    page: 0,
    results: [
        {
            id: 1,
            num_order: Z17479110881,
            status: 1,
            date_create: 2022-09-20 10:27:21.240752,
            date_pay: 2022-09-20 10:27:21.240752,
            date_delivery: 2022-09-20 10:27:21.240752,
            date_shipment: 2022-09-20 10:27:21.240752,
        }
        ...
    ]
}
```

/orders/search

```
code: 200
{
    page: 0,
    results: [
        {
            id: 1,
            num_order: Z17479110881,
            status: 1,
            date_create: 2022-09-20 10:27:21.240752,
            date_pay: 2022-09-20 10:27:21.240752,
            date_delivery: 2022-09-20 10:27:21.240752,
            date_shipment: 2022-09-20 10:27:21.240752,
        }
        ...
    ]
}
```

/orders/users

```
code: 200
{
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

# Гараж
## Техника
### Запрос техники
```
await fetch("/garage", {
    method: "get",
    headers: { 
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
})
```
### Поиск техники
```
await fetch("/garage/search?request=72642683", {
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
    "message": "Нет добавленной техники"
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
            "brand": "LUDA (RJ3)",
            "model": "RC1",
            "serial_number" 72642683,
            "year_manufacture": "2022",
        }
        ...
    ]
}
```
## Добавить технику
```
await fetch("/garage/add", {
    method: "POST",
    headers: { 
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    body: {
        "transportbrand": "LUDA (RJ3)",
        "transportmodel": "RC1",
        "transportyearproduction": "2025",
        "transportprefix": "A",
        "transportserialnumber": "32156499DFDS8",
        "enginebrand": "LUDA (RJ3)",
        "enginemodel": "TD37J",
        "enginevoltage": "48V",
        "enginefueltype": "Дизель",
        "engineserialnumber": "32156499DFDS8",
        "mastbrand": "LUDA (RJ3)",
        "mastmodel": "DW23",
        "mastheight": 123,
        "mastserialnumber": "32156499DFDS8",
        "mastsections": 1,
        "mastcylinders": 1,
        "text": "Крутой и непонятный",,
        "image": ['temp/1.jpg', 'temp/2.jpg', 'temp/3.jpg',]
    }
})
```
## Запросить запчасти
```
await fetch("/garage/request", {
    method: "POST",
    headers: { 
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    body: {
        "transporid": 4233,
        "titleparts": "Пружина",
        "numparts": "9395003220"
        "count": "3"
        "comment": "Ну такая круглая"
    }
})
```

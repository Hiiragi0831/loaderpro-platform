# Подбор ЗЧ

```
await fetch("/garage/add", {
    method: "POST",
    headers: { 
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    body: {
        "transportbrand": "PCMIDWEST (BA2)",
        "transportmodel": "S2",
        "transportyearproduction": "2005",
        "transportprefix": "B",
        "transportserialnumber": "321651465410",
        "enginebrand": "LUDA (RJ3)",
        "enginemodel": "2A",
        "enginevoltage": "48V",
        "enginefueltype": "Дизель",
        "engineserialnumber": "321651465410",
        "mastbrand": "OLD TRACPIECES (RG4)",
        "mastmodel": "VDW2F3",
        "mastheight": "105",
        "mastserialnumber": "321651465410",
        "mastsections": "3",
        "mastcylinders": "8",
        "text": "Магический ТС",
        "image": ['temp/1.jpg', 'temp/2.jpg', 'temp/3.jpg',]
    }
})
```
### Ответ от сервера
```
code: 200

{
    "status": "success",
    "transporid": 4233,
}
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

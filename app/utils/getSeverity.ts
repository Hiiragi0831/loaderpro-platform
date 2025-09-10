export const getSeverityText = (status: string) => {
  switch (status) {
    case "В идентификации":
    case "В запросе":
    case "Срок уточняется":
      return "text-yellow-500";
    case "Нет предложений":
    case "Некорректный номер":
      return "text-red-500";
    default:
      return "text-green-500";
  }
};

export const getSeverityBg = (status: string) => {
  switch (status) {
    case "В запросе":
    case "Счет отправлен":
      return "bg-yellow-100 text-yellow-800";
    case "Обработан":
    case "Отгружен":
      return "bg-green-100 text-green-800";
    case "Подбор":
    case "Счет оплачен":
      return "bg-blue-100 text-blue-800";
    case "В пути":
      return "bg-sky-100 text-sky-800";
    case "Отменен":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

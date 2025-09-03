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
      return "bg-yellow-100 text-yellow-800";
    case "Обработан":
      return "bg-green-100 text-green-800";
    case "Подбор":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

export const userSchema = toTypedSchema(
  z.object({
    // Основная информация
    firstname: z.string({ required_error: "Введите имя" }).min(1, "Введите имя"),
    lastname: z.string({ required_error: "Введите фамилию" }).min(1, "Введите фамилию"),
    position: z.string({ required_error: "Введите должность" }).min(1, "Введите должность"),
    phone: z.string({ required_error: "Введите телефон" }).min(1, "Введите телефон"),
    inn: z
      .string({ required_error: "Введите ИНН" })
      .min(10, "ИНН должен содержать минимум 10 цифр")
      .max(12, "ИНН должен содержать максимум 12 цифр"),
    company: z.string({ required_error: "Введите наименование компании" }).min(1, "Введите наименование компании"),

    // Адреса
    actualAddress: z.string({ required_error: "Введите фактический адрес" }).min(1, "Введите фактический адрес"),
    legalAddress: z.string({ required_error: "Введите юридический адрес" }).min(1, "Введите юридический адрес"),
    postalAddress: z.string({ required_error: "Введите почтовый адрес" }).min(1, "Введите почтовый адрес"),

    // Настройки уведомлений
    emailNotifications: z.string({ required_error: "Введите электронную почту" }).min(1, "Введите электронную почту"),

    // Настройки для заказов
    deliveryCity: z.string({ required_error: "Введите город доставки" }).min(1, "Введите город доставки"),
    deliveryAddress: z.string({ required_error: "Введите адрес доставки" }).min(1, "Введите адрес доставки"),
    carrier: z.string({ required_error: "Выберите перевозчика" }).min(1, "Выберите перевозчика"),
    shippingPriority: z.string({ required_error: "Выберите приоритет отгрузки" }).min(1, "Выберите приоритет отгрузки"),
    deliveryMethod: z.string({ required_error: "Введите метод доставки" }).min(1, "Введите метод доставки"),
  }),
);

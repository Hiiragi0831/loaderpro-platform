import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

export const orderSchema = toTypedSchema(
  z.object({
    company: z
      .string({ required_error: "Введите наименование компании" })
      .min(1, "Введите наименование компании"),
    inn: z
      .string({ required_error: "Введите ИНН компании" })
      .min(1, "Введите ИНН компании"),
    firstname: z
      .string({ required_error: "Введите имя" })
      .min(1, "Введите имя"),
    surname: z
      .string({ required_error: "Введите фамилию" })
      .min(1, "Введите фамилию"),
    carrier: z
      .string({ required_error: "Выберите перевозчика" })
      .min(1, "Выберите перевозчика"),
    phone: z
      .string({ required_error: "Введите телефон" })
      .min(1, "Введите телефон"),
    method: z
      .string({ required_error: "Введите метод доставки" })
      .min(1, "Введите метод доставки"),
    city: z
      .string({ required_error: "Введите город доставки" })
      .min(1, "Введите город доставки"),
    address: z
      .string({ required_error: "Введите адрес доставки" })
      .min(1, "Введите адрес доставки"),
    priority: z
      .string({ required_error: "Выберите приоритет отгрузки" })
      .min(1, "Выберите приоритет отгрузки"),
  }),
);

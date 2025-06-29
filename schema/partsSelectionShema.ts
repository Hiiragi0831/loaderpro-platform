import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

export const partsSelectionSchema = toTypedSchema(
  z.object({
    transportbrand: z.number({
      required_error: 'Выберите бренд транспорта',
      invalid_type_error: 'Бренд транспорта должен быть числом',
    }),
    transportmodel: z.string({
      required_error: 'Укажите модель транспорта',
      invalid_type_error: 'Модель транспорта должна быть строкой',
    }).min(1, 'Укажите модель транспорта'),
    transportyearproduction: z.string({
      required_error: 'Укажите год производства',
      invalid_type_error: 'Введите год производства в формате YYYY',
    })
      .min(4, 'Год должен состоять из 4 цифр')
      .max(4, 'Год должен состоять из 4 цифр')
      .regex(/^\d{4}$/, 'Год должен содержать только 4 цифры'),
    transportserialnumber: z.string({
      required_error: 'Укажите серийный номер',
      invalid_type_error: 'Серийный номер должен быть строкой',
    }).min(1, 'Укажите серийный номер'),
  })
)

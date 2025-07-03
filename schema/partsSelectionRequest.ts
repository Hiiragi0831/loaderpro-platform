import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

export const partsSelectionRequest = toTypedSchema(
  z.object({
    titleParts: z
      .string({ required_error: 'Введите наименование запчасти' })
      .min(1, 'Введите наименование запчасти'),
    numParts: z
      .string({ required_error: 'Введите номер запчасти' })
      .min(1, 'Введите номер запчасти'),
    count: z
      .number({ required_error: 'Укажите количество', invalid_type_error: 'Введите число' })
      .min(1, 'Количество должно быть больше 0'),
    comment: z.string().optional(),
  }),
)

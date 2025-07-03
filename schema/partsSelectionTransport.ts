import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

export const partsSelectionTransport = toTypedSchema(
  z.object({
    transportBrand: z.string({
      required_error: 'Выберите бренд транспорта',
      invalid_type_error: 'Бренд транспорта должен быть числом',
    }),
    transportModel: z.string({
      required_error: 'Укажите модель транспорта',
      invalid_type_error: 'Модель транспорта должна быть строкой',
    }).min(1, 'Укажите модель транспорта'),
    transportYearProduction: z.string({
      required_error: 'Укажите год производства',
      invalid_type_error: 'Год должен быть строкой из 4 цифр',
    })
      .regex(/^\d{4}$/, 'Год должен состоять из 4 цифр'),
    transportSerialNumber: z.string({
      required_error: 'Укажите серийный номер',
      invalid_type_error: 'Серийный номер должен быть строкой',
    }).min(1, 'Укажите серийный номер'),
    transportPrefix: z.string().optional(),
    engineBrand: z.string().optional(),
    engineModel: z.string().optional(),
    engineVoltage: z.string().optional(),
    engineFuelType: z.string().optional(),
    engineSerialNumber: z.string().optional(),
    mastBrand: z.string().optional(),
    mastModel: z.string().optional(),
    mastHeight: z.number().optional(),
    mastSerialNumber: z.string().optional(),
    mastSections: z.number().optional(),
    mastCylinders: z.number().optional(),
    textComment: z.string().optional(),
  }),
)

import { z } from 'zod'

export const numberValidation = z.coerce
  .number({
    required_error: 'id é obrigatório',
    invalid_type_error: 'id não é um número',
  })
  .optional()

export const dateValidation = (date: string) => {
  try {
    const validDate = z.string().date()
    const verification = validDate.parse(date)
    return verification
  } catch (error) {
    throw new Error('não é uma data válida', { cause: 404 })
  }
}

export const completedDateValidation = (date: string) => {
  try {
    const validDate = z.string().date().nullable().optional()
    const verification = validDate.parse(date)
    return verification
  } catch (error) {
    throw new Error('não é uma data válida', { cause: 404 })
  }
}

import { z } from 'zod'
import { BadRequestError } from './api.errors.js'

export const numberValidation = (value: any): number | undefined => {
  try {
    return z.coerce
      .number({
        required_error: 'id é obrigatório',
        invalid_type_error: 'id não é um número',
      })
      .optional()
      .parse(value)
  } catch (error: any) {
    throw new BadRequestError(error.errors?.[0]?.message || 'Erro de validação')
  }
}

export const dateValidation = (date: string) => {
  try {
    const validDate = z.string().date()
    const verification = validDate.parse(date)
    return verification
  } catch (error) {
    throw new BadRequestError('não é uma data válida')
  }
}

export const completedDateValidation = (date: string) => {
  try {
    const validDate = z.string().date().nullable().optional()
    const verification = validDate.parse(date)
    return verification
  } catch (error) {
    throw new BadRequestError('não é uma data válida')
  }
}

import { Usuario } from '@prisma/client'
import { Request } from 'express'
import multer from 'multer'
import path from 'path'

interface AuthenticatedRequest extends Request {
  context?: {
    user: any
  }
}

export const storage = multer.diskStorage({
  destination: (req: Request, file, callback) => {
    callback(null, path.resolve('uploads'))
  },
  filename: (req: AuthenticatedRequest, file, callback) => {
    const { username } = req.context?.user as Usuario

    callback(null, `perfilImage_${username}.jpg`)
  },
})

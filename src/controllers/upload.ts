import express, { Request, Response } from 'express'
import multer from 'multer'
import { storage } from '../../multerConfig.js'

interface AuthenticatedRequest extends Request {
  context?: {
    user: any
  }
}

const uploadFile = multer({ storage: storage })
const router = express.Router()

function uploadImage(__req: AuthenticatedRequest, res: Response) {
  return res.json({ message: 'arquivo salvo com sucesso' })
}

router.post('/image', uploadFile.single('file'), uploadImage)

export default router

import express from 'express';
import uploadMiddleware from '../middlewares/upload';
import uploadService from '../services/upload';

const router = express.Router();

router.post('/', uploadMiddleware, uploadService);

export default router;

import express from 'express';
import uploadRoute from './uploads';

const router = express.Router();

router.use('/uploads/v1', uploadRoute);

export default router;

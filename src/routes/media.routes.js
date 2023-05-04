import { Router } from 'express';
import { UploadImage } from '../controllers/media.controller.js';

const router = Router();

router.post('/upload-image', UploadImage);

export default router;
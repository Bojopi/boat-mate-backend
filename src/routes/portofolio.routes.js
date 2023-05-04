import { Router } from 'express';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { validateRol } from '../middlewares/validate-rol.js';
import { uploadPortofolio } from '../controllers/portofolio.controller.js';

const router = Router();

router.post('/portofolio/:idProvider', [
    validateJWT,
    validateRol('PROVIDER')
], uploadPortofolio);

export default router;
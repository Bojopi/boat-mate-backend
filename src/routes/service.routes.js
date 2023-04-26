import { Router } from 'express';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { validateRol } from '../middlewares/validate-rol.js';
import { getAllServices } from '../controllers/service.controller.js';

const router = Router();

router.get('/services', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], getAllServices);

export default router;
import { Router } from 'express';
import { getAllProviders } from '../controllers/provider.controller.js';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { validateRol } from '../middlewares/validate-rol.js';

const router = Router();

router.get('/providers', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], getAllProviders);

export default router;
import { Router } from 'express';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { validateRol } from '../middlewares/validate-rol.js';
import { getServiceHistory } from '../controllers/customer.controller.js';

const router = Router();

router.get('/service-history', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], getServiceHistory);

export default router;
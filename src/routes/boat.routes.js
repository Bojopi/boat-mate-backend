import { Router } from 'express';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { validateRol } from '../middlewares/validate-rol.js';
import { getAllBoats } from '../controllers/boat.controller.js';

const router = Router();

router.get('/boats', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], getAllBoats);

export default router;
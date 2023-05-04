import { Router } from 'express';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { validateRol } from '../middlewares/validate-rol.js';
import { getRatingProvider } from '../controllers/rating.controller.js';

const router = Router();

router.get('/rating-provider/:id_provider', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN', 'PROVIDER')
], getRatingProvider);

export default router;
import { Router } from 'express';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { validateRol } from '../middlewares/validate-rol.js';
import { getAllCategories } from '../controllers/category.controller.js';

const router = Router();

router.get('/categories', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], getAllCategories);

export default router;
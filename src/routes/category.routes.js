import { Router } from 'express';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { validateRol } from '../middlewares/validate-rol.js';
import { createCategory, deleteCategory, getAllCategories, getOneCategory, getServicesCategory, updateCategory } from '../controllers/category.controller.js';

const router = Router();

router.get('/categories', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], getAllCategories);

router.get('/category/:idCategory', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], getOneCategory);

router.post('/category', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], createCategory);

router.post('/category/:idCategory', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], updateCategory);

router.delete('/category/:idCategory', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], deleteCategory);

router.get('/category-services/:idCategory', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], getServicesCategory);

export default router;
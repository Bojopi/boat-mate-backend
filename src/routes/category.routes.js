import { Router } from 'express';
import { validateJWT, validateJWTExpired } from '../middlewares/validate-jwt.js';
import { validateRol } from '../middlewares/validate-rol.js';
import { createCategory, deleteCategory, getAllCategories, getOneCategory, getServicesCategory, updateCategory } from '../controllers/category.controller.js';

const router = Router();

router.get('/categories', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], getAllCategories);

router.get('/category/:idCategory', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], getOneCategory);

router.post('/category', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], createCategory);

router.post('/category/:idCategory', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], updateCategory);

router.delete('/delete-category/:idCategory', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], deleteCategory);

router.get('/category-services/:idCategory', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], getServicesCategory);

export default router;
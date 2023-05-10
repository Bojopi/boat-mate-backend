import { Router } from 'express';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { validateRol } from '../middlewares/validate-rol.js';
import { addCategory, createService, deleteCategory, deleteService, getAllServices, getCategoriesService, getOneService, getProvidersService, updateService } from '../controllers/service.controller.js';

const router = Router();

router.get('/services', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], getAllServices);

router.get('/service/:idService', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], getOneService);

router.get('/service-categories/:idService', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], getCategoriesService);

router.get('/provider-service/:idService', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN', 'CUSTOMER')
], getProvidersService);

router.post('/service/:idService', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], updateService);

router.post('/add-category/:idService', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], addCategory);

router.post('/service', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], createService);

router.delete('/delete-category/:idService', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], deleteCategory);

router.delete('/service/:idService', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], deleteService);

export default router;
import { Router } from 'express';
import { validateJWT, validateJWTExpired } from '../middlewares/validate-jwt.js';
import { validateRol } from '../middlewares/validate-rol.js';
import { activateService, addCategory, createService, deleteCategory, deleteService, getAllServices, getCategoriesService, getOneService, getProvidersService, updateService } from '../controllers/service.controller.js';

const router = Router();

router.get('/services', getAllServices);

router.get('/service/:idService', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], getOneService);

router.get('/service-categories/:idService', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], getCategoriesService);

router.get('/provider-service/:idService',  getProvidersService);

router.post('/service/:idService', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], updateService);

router.post('/add-category/:idService', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], addCategory);

router.post('/service', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], createService);

router.post('/delete-service/:idService', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], deleteService);

router.post('/activate-service/:idService', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], activateService);

router.delete('/drop-category/:idService', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], deleteCategory);


export default router;
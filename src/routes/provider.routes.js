import { Router } from 'express';
import { validateJWT, validateJWTExpired } from '../middlewares/validate-jwt.js';
import { validateRol } from '../middlewares/validate-rol.js';
import { addService, deleteService, getAllProviders, getProvider, getServiceProvider, getServicesProvider, updateProvider, updateService, uploadLicense } from '../controllers/provider.controller.js';

const router = Router();

router.get('/providers', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN', 'CUSTOMER')
], getAllProviders);

router.get('/provider/:idProvider', [
    validateJWTExpired,
    validateJWT
], getProvider);

router.post('/provider-edit/:idProvider', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], updateProvider)

router.get('/service-provider/:idProvider', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN', 'PROVIDER', 'CUSTOMER')
], getServicesProvider);

router.get('/service-provider/:idProvider/:idService', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN', 'PROVIDER')
], getServiceProvider);

router.post('/service-provider/:idProvider', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN', 'PROVIDER')
], addService);

router.post('/service-provider-edit/:idProvider/:idService', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN', 'PROVIDER')
], updateService);

router.post('/provider-license/:idProvider', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN', 'PROVIDER')
], uploadLicense);

router.delete('/service-provider/:idProvider/:idService', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN', 'PROVIDER')
], deleteService);

export default router;
import { Router } from 'express';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { validateRol } from '../middlewares/validate-rol.js';
import { addService, deleteService, getAllProviders, getProvider, getServicesProvider, updateProvider } from '../controllers/provider.controller.js';

const router = Router();

router.get('/providers', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], getAllProviders);

router.get('/provider/:idProvider', [
    validateJWT
], getProvider);

router.post('/provider-edit/:idProvider', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], updateProvider)

router.get('/service-provider/:idProvider', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN', 'PROVIDER')
], getServicesProvider);

router.post('/service-provider/:idProvider', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN', 'PROVIDER')
], addService);

router.delete('/service-provider/:idProvider', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN', 'PROVIDER')
], deleteService);

export default router;
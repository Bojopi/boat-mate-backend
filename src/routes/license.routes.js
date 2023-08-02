import { Router } from 'express';
import { validateJWT, validateJWTExpired } from '../middlewares/validate-jwt.js';
import { validateRol } from '../middlewares/validate-rol.js';
import { getLicenses, uploadLicense } from '../controllers/license.controller.js';


const router = Router();

router.get('/provider-license/:idProvider', [
    validateJWTExpired,
    validateJWT
], getLicenses);

// router.get('/portofolio/:idPortofolio', [
//     validateJWTExpired,
//     validateJWT,
//     validateRol('ADMIN', 'SUPERADMIN', 'PROVIDER')
// ], getOnePortofolio);

router.post('/provider-license/:idProvider', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN', 'PROVIDER')
], uploadLicense);

// router.post('/update-portofolio/:idPortofolio', [
//     validateJWTExpired,
//     validateJWT,
//     validateRol('ADMIN', 'SUPERADMIN', 'PROVIDER')
// ], updatePortofolio);

// router.delete('/portofolio/:idPortofolio', [
//     validateJWTExpired,
//     validateJWT,
//     validateRol('ADMIN', 'SUPERADMIN' ,'PROVIDER')
// ], deleteImagePortofolio);

export default router;
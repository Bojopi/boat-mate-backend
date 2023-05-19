import { Router } from 'express';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { validateRol } from '../middlewares/validate-rol.js';
import { deleteImagePortofolio, getOnePortofolio, getPortofolio, updatePortofolio, uploadPortofolio } from '../controllers/portofolio.controller.js';

const router = Router();

router.get('/portofolios/:idProvider', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN', 'PROVIDER')
], getPortofolio);

router.get('/portofolio/:idPortofolio', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN', 'PROVIDER')
], getOnePortofolio);

router.post('/portofolio/:idProvider', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN' ,'PROVIDER')
], uploadPortofolio);

router.post('/update-portofolio/:idPortofolio', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN', 'PROVIDER')
], updatePortofolio);

router.delete('/portofolio/:idPortofolio', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN' ,'PROVIDER')
], deleteImagePortofolio);

export default router;
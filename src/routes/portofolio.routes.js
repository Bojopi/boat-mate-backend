import { Router } from 'express';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { validateRol } from '../middlewares/validate-rol.js';
import { deleteImagePortofolio, getPortofolio, updatePortofolio, uploadPortofolio } from '../controllers/portofolio.controller.js';

const router = Router();

router.get('/portofolio/:idProvider', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN', 'PROVIDER')
], getPortofolio);

router.post('/portofolio/:idProvider', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN' ,'PROVIDER')
], uploadPortofolio);

router.post('/update-portofolio/:idPortofolio', [
    validateJWT,
    validateRol('PROVIDER')
], updatePortofolio);

router.delete('/portofolio/:idPortofolio', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN' ,'PROVIDER')
], deleteImagePortofolio);

export default router;
import { Router } from 'express';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { validateRol } from '../middlewares/validate-rol.js';
import { getPortofolio, updatePortofolio, uploadPortofolio } from '../controllers/portofolio.controller.js';

const router = Router();

router.get('/portofolio/:idProvider', [
    validateJWT,
    validateRol('PROVIDER')
], getPortofolio);

router.post('/portofolio/:idProvider', [
    validateJWT,
    validateRol('PROVIDER')
], uploadPortofolio);

router.post('/update-portofolio/:idPortofolio', [
    validateJWT,
    validateRol('PROVIDER')
], updatePortofolio);

export default router;
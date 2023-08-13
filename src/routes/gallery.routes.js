import { Router } from 'express';
import { validateJWT, validateJWTExpired } from '../middlewares/validate-jwt.js';
import { validateRol } from '../middlewares/validate-rol.js';
import { getOneGallery, getGallery, uploadGalleryImages } from '../controllers/gallery.controller.js';

const router = Router();

router.get('/galleries/:idContract', [
    validateJWTExpired,
    validateJWT
], getGallery);

router.get('/gallery/:idGallery', [
    validateJWTExpired,
    validateJWT
], getOneGallery);

router.post('/gallery/:idContract', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN' ,'CUSTOMER')
], uploadGalleryImages);

export default router;
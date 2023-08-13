import { Router } from 'express';
import { validateJWT, validateJWTExpired } from '../middlewares/validate-jwt.js';
import { validateRol } from '../middlewares/validate-rol.js';
import { changeVisible, getAllRatings, getCustomersPost, getOneRating, getRatingProvider, postRating, updateRating } from '../controllers/rating.controller.js';

const router = Router();

router.get('/ratings', getAllRatings);

router.get('/rating/:idRating', [
    validateJWTExpired,
    validateJWT
], getOneRating);

router.get('/customer-rating/:idCustomer', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN', 'CUSTOMER')
], getCustomersPost);

router.get('/provider-rating/:idProvider', getRatingProvider);

router.post('/post-rating/:idCustomer', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN', 'CUSTOMER')
], postRating);

router.post('/update-rating/:idRating', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN', 'CUSTOMER')
], updateRating);

router.post('/visible-rating/:idRating', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN', 'PROVIDER')
], changeVisible);

export default router;
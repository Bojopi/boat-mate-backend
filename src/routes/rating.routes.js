import { Router } from 'express';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { validateRol } from '../middlewares/validate-rol.js';
import { deleteRating, getAllRatings, getCustomersPost, getOneRating, getRatingProvider, postRating, updateRating } from '../controllers/rating.controller.js';

const router = Router();

router.get('/ratings', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], getAllRatings);

router.get('/rating/:idRating', [
    validateJWT
], getOneRating);

router.get('/customer-rating/:idCustomer', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN', 'CUSTOMER')
], getCustomersPost);

router.get('/rating-provider/:idProvider', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN', 'PROVIDER')
], getRatingProvider);

router.post('/rating/:idCustomer', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN', 'CUSTOMER')
], postRating);

router.post('/update-rating/:idRating', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN', 'CUSTOMER')
], updateRating);

router.delete('/rating/:idRating', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], deleteRating);

export default router;
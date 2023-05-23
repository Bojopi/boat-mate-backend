import { Router } from 'express';
import { validateJWT, validateJWTExpired } from '../middlewares/validate-jwt.js';
import { validateRol } from '../middlewares/validate-rol.js';
import { createBoat, deleteBoat, getAllBoats, getBoat, getBoatsCustomerId, updateBoat } from '../controllers/boat.controller.js';

const router = Router();

router.get('/boats', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], getAllBoats);

router.get('/boat/:idBoat', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN', 'CUSTOMER')
], getBoat);

router.get('/boat-customer/:idCustomer', [
    validateJWTExpired,
    validateJWT,
    validateRol('CUSTOMER')
], getBoatsCustomerId);

router.post('/boat/:idCustomer', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN', 'CUSTOMER')
], createBoat)

router.post('/update-boat/:idBoat', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN', 'CUSTOMER')
], updateBoat);

router.delete('/delete-boat/:idBoat', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN', 'CUSTOMER')
], deleteBoat);

export default router;
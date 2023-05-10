import { Router } from 'express';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { validateRol } from '../middlewares/validate-rol.js';
import { createBoat, deleteBoat, getAllBoats, getBoat, getBoatsCustomerId, updateBoat } from '../controllers/boat.controller.js';

const router = Router();

router.get('/boats', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], getAllBoats);

router.get('/boat-customer/:idCustomer', [
    validateJWT,
    validateRol('CUSTOMER')
], getBoatsCustomerId);

router.post('/boat/:idBoat', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN', 'CUSTOMER')
], getBoat);

router.post('/boat-edit/:idBoat', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN', 'CUSTOMER')
], updateBoat);

router.post('/create-boat/:idCustomer', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN', 'CUSTOMER')
], createBoat)

router.delete('/boat/:idBoat', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN', 'CUSTOMER')
], deleteBoat);

export default router;
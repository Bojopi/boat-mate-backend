import { Router } from 'express';
import { validateJWT, validateJWTExpired } from '../middlewares/validate-jwt.js';
import { validateRol } from '../middlewares/validate-rol.js';
import { getCustomer, getCustomers } from '../controllers/customer.controller.js';

const router = Router();

router.get('/customers', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], getCustomers);

router.get('/customer/:idCustomer', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], getCustomer);

export default router;
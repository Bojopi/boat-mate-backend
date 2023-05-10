import { Router } from 'express';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { validateRol } from '../middlewares/validate-rol.js';
import { createContract, getContracsProvider, getCustomer, getCustomers, getServiceHistory, updateState } from '../controllers/customer.controller.js';

const router = Router();

router.get('/service-history', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], getServiceHistory);

router.get('/contract-provider/:idProvider', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN', 'PROVIDER')
], getContracsProvider);

router.get('/customers', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], getCustomers);

router.get('/customer/:idCustomer', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], getCustomer);

router.post('/contract/:idCustomer', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN', 'CUSTOMER')
], createContract);

router.post('/state-contract/:idContract', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN', 'PROVIDER')
], updateState);

export default router;
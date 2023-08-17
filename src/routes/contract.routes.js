import { Router } from 'express';
import { validateJWT, validateJWTExpired } from '../middlewares/validate-jwt.js';
import { validateRol } from '../middlewares/validate-rol.js';
import { createContract, getContracsCustomer, getContracsProvider, getContracts, getHiredServices, getOneContract, updateContract, updateState } from '../controllers/contract.controller.js';
import { validateIdCustomer } from '../middlewares/validate-id-customer.js';

const router = Router();

router.get('/contracts', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], getContracts);

router.get('/contract/:idContract', [
    validateJWTExpired,
    validateJWT
], getOneContract);

router.get('/contract-provider/:idProvider', [
    validateJWTExpired,
    validateJWT
], getContracsProvider);

router.get('/contract-customer/:idCustomer', [
    validateJWTExpired,
    validateJWT
], getContracsCustomer);

router.get('/hired-services', getHiredServices);

router.post('/contract/:idCustomer', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN', 'CUSTOMER'),
    // validateIdCustomer
], createContract);

router.post('/update-contract/:idContract', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN', 'PROVIDER')
], updateContract);

router.post('/state-contract/:idContract', [
    validateJWTExpired,
    validateJWT
], updateState);

export default router;
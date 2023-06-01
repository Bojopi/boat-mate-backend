import { Router } from 'express';
import { validateJWT, validateJWTExpired } from '../middlewares/validate-jwt.js';
import { validateRol } from '../middlewares/validate-rol.js';
import { createContract, getContracsProvider, getContracts, getOneContract, updateContract, updateState } from '../controllers/contract.controller.js';

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

router.post('/contract/:idCustomer', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN', 'CUSTOMER')
], createContract);

router.post('/update-contract/:idContract', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN', 'PROVIDER')
], updateContract);

router.post('/state-contract/:idContract', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN', 'PROVIDER')
], updateState);

export default router;
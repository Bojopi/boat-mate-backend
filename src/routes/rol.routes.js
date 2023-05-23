import { Router } from 'express';
import { activateRole, createRole, deleteRole, getAllRoles, getRole, updateRole } from "../controllers/rol.controller.js";
import { validateJWT, validateJWTExpired } from '../middlewares/validate-jwt.js';
import { validateRol } from '../middlewares/validate-rol.js';

const router = Router();

router.get('/roles', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], getAllRoles);

router.get('/roles/:id', [
    validateJWTExpired,
    validateJWT
] , getRole);

router.post('/role', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], createRole);

router.post('/delete-role/:idRole', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], deleteRole);

router.post('/role/:idRole', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], updateRole);

router.post('/activate-role/:idRole', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], activateRole);

export default router;
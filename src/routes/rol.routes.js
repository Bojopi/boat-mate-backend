import { Router } from 'express';
import { createRole, deleteRole, getAllRoles, getRole, updateRole } from "../controllers/rol.controller.js";
import { validateJWT } from '../middlewares/validate-jwt.js';
import { validateRol } from '../middlewares/validate-rol.js';

const router = Router();

router.get('/roles', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], getAllRoles);

router.get('/roles/:id', getRole);

router.post('/role', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], createRole);

router.delete('/role/:idRole', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], deleteRole);

router.post('/role/:idRole', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], updateRole);

export default router;
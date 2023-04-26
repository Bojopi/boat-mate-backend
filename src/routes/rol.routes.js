import { Router } from 'express';
import { getAllRoles, getRole } from "../controllers/rol.controller.js";
import { validateJWT } from '../middlewares/validate-jwt.js';
import { validateRol } from '../middlewares/validate-rol.js';

const router = Router();

router.get('/roles', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], getAllRoles);

router.get('/roles/:id', getRole)

export default router;
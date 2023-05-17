import { Router } from 'express';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { validateRol } from '../middlewares/validate-rol.js';
import { createUserProfile, deleteProfile, getUser, getUsersAll, setDataProfile, setRoleUser, setUser } from '../controllers/profile.controller.js';

const router = Router();

router.get('/profiles', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], getUsersAll);

router.get('/profile/:idProfile', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], getUser);

router.post('/profile/:id', [ validateJWT ], setDataProfile);

router.post('/profile-role/:id', [ validateJWT ] , setRoleUser);

router.post('/delete-profile/:idProfile', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], deleteProfile);

router.post('/profile', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], createUserProfile);

router.post('/profile-edit/:idProfile', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], setUser);

export default router;
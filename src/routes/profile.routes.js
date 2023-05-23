import { Router } from 'express';
import { validateJWT, validateJWTExpired } from '../middlewares/validate-jwt.js';
import { validateRol } from '../middlewares/validate-rol.js';
import { activateProfile, createUserProfile, deleteProfile, getUser, getUsersAll, setDataProfile, setRoleUser, setUser } from '../controllers/profile.controller.js';

const router = Router();

router.get('/profiles', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], getUsersAll);

router.get('/profile/:idProfile', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], getUser);

router.post('/profile/:id', [ validateJWTExpired, validateJWT ], setDataProfile);

router.post('/profile-role/:idProfile', [ validateJWTExpired, validateJWT ] , setRoleUser);

router.post('/delete-profile/:idProfile', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], deleteProfile);

router.post('/profile', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], createUserProfile);

router.post('/profile-edit/:idProfile', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], setUser);

router.post('/activate-profile/:idProfile', [
    validateJWTExpired,
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], activateProfile);

export default router;
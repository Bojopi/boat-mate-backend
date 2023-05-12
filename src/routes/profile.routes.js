import { Router } from 'express';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { validateRol } from '../middlewares/validate-rol.js';
import { deleteProfile, getUsersAll, setDataProfile, setRoleUser } from '../controllers/profile.controller.js';

const router = Router();

router.get('/profiles', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], getUsersAll);
router.post('/profile/:id', [ validateJWT ], setDataProfile);
router.post('/profile-role/:id', [ validateJWT ] , setRoleUser);
router.post('/delete-profile/:idProfile', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], deleteProfile)

export default router;
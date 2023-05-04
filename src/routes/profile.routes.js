import { Router } from 'express';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { validateRol } from '../middlewares/validate-rol.js';
import { setDataProfile } from '../controllers/profile.controller.js';

const router = Router();

router.post('/profile/:id', [
    validateJWT,
], setDataProfile);

export default router;
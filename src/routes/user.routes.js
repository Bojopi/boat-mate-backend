import { Router } from 'express';

import { getUsersAll, setRoleUser } from '../controllers/user.controller.js';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { validateRol } from '../middlewares/validate-rol.js';



const router = Router();

router.post('/users', [
    validateJWT,
    validateRol('ADMIN', 'SUPERADMIN')
], getUsersAll);
router.post('/user/:id', [validateJWT] , setRoleUser);


export default router;
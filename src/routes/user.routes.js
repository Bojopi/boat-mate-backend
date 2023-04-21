import { Router } from 'express';

import { setRoleUser } from '../controllers/user.controller.js';
import { validateJWT } from '../middlewares/validate-jwt.js';



const router = Router();

router.post('/user/:id', [validateJWT] , setRoleUser);


export default router;
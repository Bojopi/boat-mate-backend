import { Router } from 'express';
import { check } from 'express-validator';


import { login } from '../controllers/auth.controller.js';
import { validateFields } from '../middlewares/validate-fields.js';


const router = Router();

router.post('/auth', [
    check('username', 'Username is required').isString(),
    check('password', 'Password is required').not().isEmpty(),
    validateFields
], login);


export default router;
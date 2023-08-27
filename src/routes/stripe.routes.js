import { Router } from "express";
import { validateJWT, validateJWTExpired } from '../middlewares/validate-jwt.js';
import { validateRol } from '../middlewares/validate-rol.js';
import { account } from "../controllers/stripe.controller.js";

const router = Router();

router.post('/stripe-create/:idProvider', account);

export default router;
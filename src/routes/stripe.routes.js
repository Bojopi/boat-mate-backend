import { Router } from "express";
import { validateJWT, validateJWTExpired } from '../middlewares/validate-jwt.js';
import { validateRol } from '../middlewares/validate-rol.js';
import { createAccount, createPaymentMethod, paymentMethodList } from "../controllers/stripe.controller.js";

const router = Router();

router.get('/list-payment-methods', paymentMethodList);

router.post('/stripe-create/:idProvider', createAccount);

router.post('/payment-method-create', createPaymentMethod);

export default router;
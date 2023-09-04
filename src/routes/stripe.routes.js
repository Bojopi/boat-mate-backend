import { Router } from "express";
import { validateJWT, validateJWTExpired } from '../middlewares/validate-jwt.js';
import { validateRol } from '../middlewares/validate-rol.js';
import { accountSession, checkoutSession, createExpressAccount, createPaymentMethod, createProductPrice, listAllPrices, listCapabilities, loginLink, oauthAccount, paymentIntent, paymentMethodList, viewAccount, viewPerson } from "../controllers/stripe.controller.js";

const router = Router();

router.get('/list-payment-methods', paymentMethodList);

router.get('/view-account', viewAccount);

router.get('/view-person', viewPerson);

router.get('/list-prices', listAllPrices);

router.get('/capability-account/:idStripe', listCapabilities);

router.post('/payment-intent', paymentIntent);

router.post('/checkout-session', checkoutSession);

router.post('/login-link/:stripeId', loginLink);

router.post('/account-session/:accountId', accountSession);

router.post('/stripe-create/:idProvider', createExpressAccount);

router.post('/payment-method-create', createPaymentMethod);

router.post('/oauth-account/:code/:idProvider', oauthAccount);

router.post('/product-price', createProductPrice);

export default router;
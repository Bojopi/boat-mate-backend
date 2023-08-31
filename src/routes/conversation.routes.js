import { Router } from 'express';
import { validateJWT, validateJWTExpired } from '../middlewares/validate-jwt.js';
import { validateRol } from '../middlewares/validate-rol.js';
import { createMessage, getConversation } from '../controllers/conversation.controller.js';

const router = Router();
    
router.get('/conversation/:idContract', [
    validateJWTExpired,
    validateJWT,
    validateRol('PROVIDER', 'CUSTOMER')
], getConversation);

// router.get('/customer-rating/:idCustomer', [
//     validateJWTExpired,
//     validateJWT,
//     validateRol('ADMIN', 'SUPERADMIN', 'CUSTOMER')
// ], getCustomersPost);

// router.get('/provider-rating/:idProvider', getRatingProvider);

router.post('/new-message/:idContract', [
    validateJWTExpired,
    validateJWT,
    validateRol('PROVIDER', 'CUSTOMER')
], createMessage);

// router.post('/update-rating/:idRating', [
//     validateJWTExpired,
//     validateJWT,
//     validateRol('ADMIN', 'SUPERADMIN', 'CUSTOMER')
// ], updateRating);

// router.post('/visible-rating/:idRating', [
//     validateJWTExpired,
//     validateJWT,
//     validateRol('ADMIN', 'SUPERADMIN', 'PROVIDER')
// ], changeVisible);

export default router;
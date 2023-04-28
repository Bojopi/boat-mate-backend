const passport = require('passport');
import { Router } from 'express';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { validateRol } from '../middlewares/validate-rol.js';

const router = Router();

//Ruta para iniciar sesión con google
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

//Ruta para manejar el callback de google
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/auth'}), function(req, res){
    // Aquí se redirige al usuario a la página de inicio de la aplicación
    res.redirect('/');
})
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy

passport.use(new GoogleStrategy({
    clientID: '386045670679-j1sagivv5vfbeafot2as40asmkchkjoq.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:8080/auth/google/callback'
}, function(accessToken, refreshToken, profile, cb){
    // Aquí se realiza la lógica para guardar la información del usuario en la base de datos o sesión de usuario.
    return cb(null, profile);
}))

 
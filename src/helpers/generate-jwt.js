import jwt from 'jsonwebtoken'

const jwtSecret = process.env.JWT_SECRET

export const generateJWT = ( profile ) => {

    return new Promise((resolve, reject) => {
        const {
        id_profile,
        email, 
        profile_state, 
        person:{
            dataValues: {
                person_name,
                lastname,
                phone,
                person_image
            }
        },
        role: {
            dataValues: {
                role_description
            }
        }} = profile

        const payload = { 
            uid:  id_profile,
            email: email,
            state: profile_state,
            name: person_name,
            lastname: lastname,
            phone: phone,
            image: person_image,
            role: role_description
        }

        jwt.sign(payload, jwtSecret, { expiresIn: '24h' },
        (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el token', err);
            } else {
                resolve( token );
            }
        });
    })
}
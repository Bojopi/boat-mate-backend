import jwt from 'jsonwebtoken'

export const generateJWT = ( profile ) => {

    return new Promise((resolve, reject) => {
        const {
        id_profile,
        email, 
        state, 
        person:{
            dataValues: {
                name,
                lastname,
                phone,
                image
            }
        },
        role: {
            dataValues: {
                description_role
            }
        }} = profile

        const payload = { 
            uid:  id_profile,
            email: email,
            state: state,
            name: name,
            lastname: lastname,
            phone: phone,
            image: image,
            role: description_role
        }

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' },
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
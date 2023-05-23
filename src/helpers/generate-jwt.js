import jwt from 'jsonwebtoken'

export const generateJWT = ( profile ) => {

    return new Promise((resolve, reject) => {
        const {
        id_profile,
        email,
        profile_state,
        google,
        id_person,
        person_name,
        lastname,
        phone,
        person_image,
        id_role,
        role_description,
        id_provider,
        provider_name,
        provider_image,
        provider_description,
        provider_lat,
        provider_lng,
        id_customer,
        customer_lat,
        customer_lng,
        } = profile

        const payload = {
            uid:  id_profile,
            email: email,
            state: profile_state,
            google: google,
            idPerson: id_person,
            name: person_name,
            lastname: lastname,
            phone: phone,
            image: person_image,
            idRole: id_role,
            role: role_description,
            idProvider: id_provider,
            providerName: provider_name,
            providerImage: provider_image,
            providerDescription: provider_description,
            providerLat: provider_lat,
            providerLng: provider_lng,
            idCustomer: id_customer,
            customerLat: customer_lat,
            customerLng: customer_lng
        }

        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "23h"},
        (err, token) => {
            if (err) {
                console.log(err);
                reject('Could not generate token', err);
            } else {
                resolve( token );
            }
        });
    })
}

export const updateJWT = async (profile, tokenUser) => {

    return new Promise((resolve, reject) => {

        const {
            id_profile,
            email,
            profile_state,
            google,
            id_person,
            person_name,
            lastname,
            phone,
            person_image,
            id_role,
            role_description,
            id_provider,
            provider_name,
            provider_image,
            zip,
            provider_description,
            provider_lat,
            provider_lng,
            id_customer,
            customer_lat,
            customer_lng,
            } = profile

        const payload = {
            uid:  id_profile,
            email: email,
            state: profile_state,
            google: google,
            idPerson: id_person,
            name: person_name,
            lastname: lastname,
            phone: phone,
            image: person_image,
            idRole: id_role,
            role: role_description,
            idProvider: id_provider,
            providerName: provider_name,
            providerImage: provider_image,
            zip: zip,
            providerDescription: provider_description,
            providerLat: provider_lat,
            providerLng: provider_lng,
            idCustomer: id_customer,
            customerLat: customer_lat,
            customerLng: customer_lng
        }


        jwt.verify(tokenUser, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                reject('Invalid token');
            }

            if (decoded.revoked) {
                reject('Token revoked')
            }

            //update data
            jwt.sign({...decoded, ...payload}, process.env.JWT_SECRET, (err, token) => {
                if (err) {
                    console.log(err);
                    reject('Could not generate token', err);
                } else {
                    resolve( token );
                }
            });

        })
    })
}
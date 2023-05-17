import { response } from "express"
import { Profile } from "../models/Profile.js";
import bcrypjs from 'bcrypt'
import { generateJWT } from "../helpers/generate-jwt.js";
import { Person } from "../models/Person.js";
import { Role } from "../models/Role.js";
import { serialize } from "cookie"
import { verify } from "jsonwebtoken";
import { googleVerify } from "../helpers/google-verify.js";
import { Provider } from "../models/Provider.js";
import { Customer } from "../models/Customer.js";
import { encriptPassword } from "../utils/bcryp.js";
import { sequelize } from "../database/database.js";

export const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        //check if the user name exists
        let profile = await Profile.findOne({
            where: { email },
            attributes: ['id_profile',
                        'email',
                        'password',
                        'profile_state',
                        'google',
                        'person.id_person',
                        'person.person_name',
                        'person.lastname',
                        'person.phone',
                        'person.person_image',
                        'role.id_role',
                        'role.role_description'
                    ],
            include: [
                {
                    model: Person,
                    attributes: []
                },
                {
                    model: Role,
                    attributes: []
                }],
            raw: true
        });

        if( !profile ) {
            return res.status(400).json({
                msg: 'There is no account registered with that email address'
            });
        }

        //if profile is active
        if(!profile.profile_state) {
            return res.status(400).json({
                msg: 'Profile is inactive'
            });
        }

        //check password
        const validPassword = bcrypjs.compareSync( password, profile.password);
        if(!validPassword) {
            return res.status(400).json({
                msg: 'Incorrect Email / Password'
            });
        }

        // check role
        if(profile.role_description === 'PROVIDER') {
            profile = await Provider.findOne({
                attributes: [
                    'id_provider',
                    'provider_name',
                    'provider_image',
                    'zip',
                    'provider_description',
                    'provider_lat',
                    'provider_lng',
                    'profile.id_profile',
                    'profile.profile_state',
                    'profile.email',
                    'profile.google',
                    'profile.person.id_person',
                    'profile.person.person_name',
                    'profile.person.lastname',
                    'profile.person.phone',
                    'profile.person.person_image',
                    'profile.role.id_role',
                    'profile.role.role_description',
                ],
                include: [{
                    model: Profile,
                    attributes: [],
                    where: {
                        id_profile: profile.id_profile
                    },
                    include: [{
                        model: Person,
                        attributes: []
                    },
                    {
                        model: Role,
                        attributes: []
                    }]
                }],
                raw: true
            })
        }

        if(profile.role_description === 'CUSTOMER') {
            profile = await Customer.findOne({
                attributes: [
                    'id_customer',
                    'customer_lat',
                    'customer_lng',
                    'profile.id_profile',
                    'profile.profile_state',
                    'profile.email',
                    'profile.google',
                    'profile.person.id_person',
                    'profile.person.person_name',
                    'profile.person.lastname',
                    'profile.person.phone',
                    'profile.person.person_image',
                    'profile.role.id_role',
                    'profile.role.role_description',
                ],
                include: [{
                    model: Profile,
                    attributes: [],
                    where: {
                        id_profile: profile.id_profile
                    },
                    include: [{
                        model: Person,
                        attributes: []
                    },
                    {
                        model: Role,
                        attributes: []
                    }]
                }],
                raw: true
            })
        }


        //generate the jwt
        const token = await generateJWT(profile);

        const serialized = serialize('tokenUser', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 1,
            path: '/',
            // domain: 'v2.boatmate.com'
        })

        res.setHeader('Set-Cookie', serialized)

        return res.json({
            msg: 'Login successfully'
        });
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

export const getUser = (req, res = response) => {
    const { tokenUser } = req.cookies;

    if(!tokenUser) {
        return res.status(401).json({ msg: 'Unauthorized' })
    }

    try {
        const user = verify(tokenUser, process.env.JWT_SECRET)
        return res.status(200).json(user)
    } catch (error) {
        return res.status(401).json({ msg: 'Invalid token' })
    }
}

export const googleSignIn = async (req, res = response) => {
    const { credential } = req.body;

    let newUser = false;

    try {
        const { name, lastname, email, image } = await googleVerify(credential)

        let user = await Profile.findOne({
            where: { email },
            include: [Person, Role]
        })

        //nonexistent user
        if(!user) {
            const data = {
                person_name: name,
                lastname: lastname,
                phone: '',
                person_image: image
            }

            const person = await Person.create(data)
            await person.createProfile({
                email: email,
                password: '123',
                profile_state: true,
                roleId: 4,
                personId: person.dataValues.id_person,
                google: true
            })

            user = await Profile.findOne({
                where: { email },
                include: [Person, Role]
            })

            newUser = true;
        }

        //if the user exists but is disabled
        if(!user.profile_state) {
            return res.status(401).json({
                msg: 'User is disabled'
            })
        }

        //generate the jwt
        const token = await generateJWT(user);

        const serialized = serialize('tokenUser', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 1,
            path: '/',
            // domain: 'v2.boatmate.com'
        })

        res.setHeader('Set-Cookie', serialized)

        res.status(200).json({
            msg: 'Login successfully',
            newUser
        })
    } catch (error) {
        res.status(401).json({
            msg: 'Invalid credential'
        })
    }
}

export const logout = (req, res = response) => {
    const { tokenUser } = req.cookies;
    console.log(tokenUser)

    if(!tokenUser) {
        return res.status(401).json({ msg: 'Unauthorized' })
    }

    try {
        verify(tokenUser, process.env.JWT_SECRET);

        const serialized = serialize('tokenUser', tokenUser, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 1,
            path: '/',
            // domain: 'v2.boatmate.com'
        })
        res.setHeader('Set-Cookie', serialized);
        res.status(200).json({ msg: 'Logout Successfully' });
    } catch (error) {
        console.log('Error:', error)
        return res.status(401).json({ msg: 'Invalid token' });
    }

}

export const createProfile = async (req, res = response) => {
    const { email,
            password,
            idRole,
            personName,
            lastname,
            phone,
            lat,
            lng,
            providerName
        } = req.body

    try {

        //check if the email already exists
        const emailExists = await Profile.findAll({
            where: { email: email }
        });

        if(emailExists.length != 0) {
            return res.status(400).json({ msg: 'Email already exists' });
        }

        const pass = await encriptPassword(password)
        const result = await sequelize.transaction(async (t) => {
            let user;
            if(idRole == 3) {
                const {id_provider} = await Provider.create({
                    provider_name: providerName,
                    provider_lat: lat,
                    provider_lng: lng,
                    provider_image: null,
                    profile: {
                        email: email,
                        password: pass,
                        roleId: idRole,
                        profile_state: true,
                        google: false,
                        person: {
                            person_name: personName,
                            lastname: lastname,
                            phone: phone,
                            person_image: null
                        }
                    }
                }, {
                    include: [{
                        model: Profile,
                        include: [{
                            model: Person
                        }, {
                            model: Role
                        }]
                    }],
                    transaction: t,
                });
                user = await Provider.findOne({
                    attributes: [
                        'id_provider',
                        'provider_name',
                        'provider_image',
                        'zip',
                        'provider_description',
                        'provider_lat',
                        'provider_lng',
                        'profile.id_profile',
                        'profile.profile_state',
                        'profile.email',
                        'profile.google',
                        'profile.person.id_person',
                        'profile.person.person_name',
                        'profile.person.lastname',
                        'profile.person.phone',
                        'profile.person.person_image',
                        'profile.role.id_role',
                        'profile.role.role_description',
                    ],
                    where: id_provider,
                    include: [{
                        model: Profile,
                        attributes: [],
                        include: [{
                            model: Person,
                            attributes: []
                        },
                        {
                            model: Role,
                            attributes: []
                        }]
                    }],
                    raw: true,
                    transaction: t
                })
            } else if(idRole == 4) {
                const {id_customer} = await Customer.create({
                    customer_lat: lat,
                    customer_lng: lng,
                    profile: {
                        email: email,
                        password: pass,
                        roleId: idRole,
                        profile_state: true,
                        google: false,
                        person: {
                            person_name: personName,
                            lastname: lastname,
                            phone: phone,
                            person_image: null
                        }
                    }
                }, {
                    include: [{
                        model: Profile,
                        include: [{
                            model: Person
                        }]
                    }],
                    transaction: t
                });

                user = await Customer.findOne({
                    attributes: [
                        'id_customer',
                        'customer_lat',
                        'customer_lng',
                        'profile.id_profile',
                        'profile.profile_state',
                        'profile.email',
                        'profile.google',
                        'profile.person.id_person',
                        'profile.person.person_name',
                        'profile.person.lastname',
                        'profile.person.phone',
                        'profile.person.person_image',
                        'profile.role.id_role',
                        'profile.role.role_description',
                    ],
                    where: id_customer,
                    include: [{
                        model: Profile,
                        attributes: [],
                        include: [{
                            model: Person,
                            attributes: []
                        },
                        {
                            model: Role,
                            attributes: []
                        }]
                    }],
                    raw: true,
                    transactions: t
                });
            }

            return user
        })
        // generate the jwt
        const token = await generateJWT(result);

        const serialized = serialize('tokenUser', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 1,
            path: '/',
            // domain: 'v2.boatmate.com'
        });

        res.setHeader('Set-Cookie', serialized);

        return res.json({
            msg: 'Register successfully'
        });
    } catch (error) {
        return res.status(400).json({msg: error.message})
    }
}
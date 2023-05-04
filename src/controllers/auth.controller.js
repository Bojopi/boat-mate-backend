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
                msg: 'Incorrect Email / Password'
            });
        }

        //if profile is active
        if(!profile.profile_state) {
            return res.status(400).json({
                msg: 'Incorrect Email / Password'
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

        // res.cookie('token', token, {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: 'none',
        //     domain: 'boatmate-backend-production.up.railway.app',
        //     // domain: 'localhost',
        //     path: '/',
        //     expires: new Date(Date.now() + 3600000) // 1 hora de duración
        //   });


        const serialized = serialize('tokenUser', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 1,
            path: '/',
            // domain: 'ec2-3-131-141-161.us-east-2.compute.amazonaws.com'
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
        // res.cookie('token', token, {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: 'none',
        //     domain: 'boatmate-backend-production.up.railway.app',
        //     // domain: 'localhost',
        //     path: '/',
        //     expires: new Date(Date.now() + 3600000) // 1 hora de duración
        //   });

        const serialized = serialize('tokenUser', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 1,
            path: '/',
            // domain: 'ec2-3-131-141-161.us-east-2.compute.amazonaws.com'
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
        // res.cookie('token', null, {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: 'none',
        //     domain: 'boatmate-backend-production.up.railway.app',
        //     // domain: 'localhost',
        //     path: '/',
        //     expires: 0
        //   });

        const serialized = serialize('tokenUser', tokenUser, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 1,
            path: '/',
            // domain: 'ec2-3-131-141-161.us-east-2.compute.amazonaws.com'
        })
        res.setHeader('Set-Cookie', serialized);
        res.status(200).json({ msg: 'Logout Successfully' });
    } catch (error) {
        console.log('Error:', error)
        return res.status(401).json({ msg: 'Invalid token' });
    }

}
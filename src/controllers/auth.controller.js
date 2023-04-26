import { response } from "express"
import { Profile } from "../models/Profile.js";
import bcrypjs from 'bcrypt'
import { generateJWT } from "../helpers/generate-jwt.js";
import { Person } from "../models/Person.js";
import { Role } from "../models/Role.js";
import { serialize } from "cookie"
import { verify } from "jsonwebtoken";
import { googleVerify } from "../helpers/google-verify.js";

export const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        //check if the user name exists
        const profile = await Profile.findOne({
            where: { email },
            include: [Person, Role]
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

        //generate the jwt
        const token = await generateJWT(profile);

        const serialized = serialize('tokenUser', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 1000 * 60 * 1,
            path: '/'
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
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 1,
            path: '/'
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

    if(!tokenUser) {
        return res.status(401).json({ msg: 'Unauthorized' })
    }

    try {
        verify(tokenUser, process.env.JWT_SECRET);
        const serialized = serialize('tokenUser', null, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 0,
            path: '/'
        });
        res.setHeader('Set-Cookie', serialized);
        res.status(200).json({ msg: 'Logout Successfully' });
    } catch (error) {
        console.log('Error:', error)
        return res.status(401).json({ msg: 'Invalid token' });
    }

}
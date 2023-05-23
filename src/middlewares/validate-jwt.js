import { request, response } from 'express';
import { Profile } from '../models/Profile.js';
import { Person } from '../models/Person.js';
import { Role } from '../models/Role.js';
import { verify } from 'jsonwebtoken';
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken'

export const validateJWT = async (req = request, res = response, next) => {
    const { tokenUser } = req.cookies;

    if(!tokenUser) {
        return res.status(401).json({
            msg: 'Token undefined'
        });
    }

    try {
        const { uid } = verify(tokenUser, process.env.JWT_SECRET);

        const profile = await Profile.findOne({where: { id_profile: uid }, include: [Person, Role]});

        if(!profile) {
            return res.status(401).json({
                msg: 'Profile invalid'
            });
        }

        if(!profile.profile_state) {
            return res.status(401).json({
                msg: 'Token invalid'
            });
        }

        req.profile = profile;

        next();
    } catch (error) {
        res.status(401).json({
            msg: 'Token invalid'
        });
    }
}

export const validateJWTExpired = async (req = request, res = response, next) => {
    const { tokenUser } = req.cookies;

    if(!tokenUser) {
        return res.status(401).json({
            msg: 'Token undefined'
        });
    }

    try {
        const profile = verify(tokenUser, process.env.JWT_SECRET);
        const now = Math.floor(Date.now() / 1000);
        const threshold = 5 * 60;
        const expiresIn = Math.floor(Date.now() / 1000) + (23 * 60 * 60);
        
        if(profile.exp - now <= threshold) {
            profile.exp = expiresIn;
            const newtoken = await new Promise((resolve, reject) => {
                jwt.sign(profile, process.env.JWT_SECRET, (err, token) => {
                    if(err) {
                        console.log(err);
                        reject(err);
                    } else {
                        console.log(token);
                        resolve(token);
                    }
                });
            });

            const serialized = serialize('tokenUser', newtoken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 1000 * 60 * 60 * 23,
                path: '/',
                // domain: 'v2.boatmate.com'
            })

            res.setHeader('Set-Cookie', serialized)
        }
        next();
    } catch (error) {
        res.status(401).json({
            msg: 'Token invalid'
        });
    }
}
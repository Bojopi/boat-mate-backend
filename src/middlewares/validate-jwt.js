import { request, response } from 'express';
import { Profile } from '../models/Profile.js';
import { Person } from '../models/Person.js';
import { Role } from '../models/Role.js';
import { verify } from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET

export const validateJWT = async (req = request, res = response, next) => {
    const { token } = req.cookies;

    if(!token) {
        return res.status(401).json({
            msg: 'Token undefined'
        });
    }

    try {
        const { uid } = verify(token, jwtSecret);

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
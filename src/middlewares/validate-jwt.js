import { request, response } from 'express';
import { Profile } from '../models/Profile.js';
import { Person } from '../models/Person.js';
import { Role } from '../models/Role.js';
import { verify } from 'jsonwebtoken';
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
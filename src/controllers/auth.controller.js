import { response } from "express"
import { Profile } from "../models/Profile.js";
import bcrypjs from 'bcrypt'
import { generateJWT } from "../helpers/generate-jwt.js";
import { Person } from "../models/Person.js";
import { Role } from "../models/Role.js";

export const login = async (req, res = response) => {

    const { username, password } = req.body;

    try {

        //check if the user name exists
        const profile = await Profile.findOne({
            where: { username },
            include: [Person, Role]
        });
        if( !profile ) {
            return res.status(400).json({
                msg: 'Incorrect Username / Password'
            });
        }

        //if profile is active
        if(!profile.state) {
            return res.status(400).json({
                msg: 'Incorrect Username / Password'
            });
        }

        //check password
        const validPassword = bcrypjs.compareSync( password, profile.password);
        if(!validPassword) {
            return res.status(400).json({
                msg: 'Incorrect Username / Password'
            });
        }

        //generate the jwt
        const token = await generateJWT(String(profile.id_profile));

        res.json({
            profile,
            token
        });
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}
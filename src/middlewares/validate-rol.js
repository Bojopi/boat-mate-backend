import { response } from "express";

export const adminRol = (req, res = response, next) => {

    if(!req.profile) {
        return res.status(500).json({ msg: "Token invalid" });
    }

    const {
        role: {rol_description},
        person: {person_name}
    } = req.profile;

    if(rol_description.toUpperCase() !== 'ADMIN') {
        return res.status(401).json({ msg: `${person_name} do not have permissions to access this functionality` });
    }

    next();
}

export const validateRol = (...roles) => {
    return (req, res = response, next) => {
        if(!req.profile) {
            return res.status(500).json({ msg: "Token invalid" });
        }

        const {
            role: {role_description, role_state},
        } = req.profile;

        if(!roles.includes(role_description) || !role_state) {
            return res.status(401).json({
                msg: `${role_description} do not have permissions to access this functionality`
            })
        }

        next()
    }
}
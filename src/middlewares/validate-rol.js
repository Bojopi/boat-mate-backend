import { response } from "express";

export const adminRol = (req, res = response, next) => {

    if(!req.profile) {
        return res.status(500).json({ msg: "Token invalid" });
    }

    const {
        role: {description_role},
        person: {name}
    } = req.profile;

    if(description_role.toUpperCase() !== 'ADMIN') {
        return res.status(401).json({ msg: `${name} do not have permissions to access this functionality` });
    }

    next();
}

export const validateRol = (...roles) => {
    return (req, res = response, next) => {
        if(!req.profile) {
            return res.status(500).json({ msg: "Token invalid" });
        }

        const {
            role: {description_role},
        } = req.profile;

        if(!roles.includes(description_role)) {
            return res.status(401).json({
                msg: `${description_role} do not have permissions to access this functionality`
            })
        }

        next()
    }
}
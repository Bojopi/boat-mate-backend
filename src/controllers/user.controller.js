import { response } from "express";
import { Profile } from "../models/Profile.js";
import { Person } from "../models/Person.js";
import { Role } from "../models/Role.js";

export const getUsersAll = async (req, res = response) => {

    try {
        const users = await Profile.findAll({
            include: [Person, Role],
            order: [
                [Person, 'person_name', 'ASC']
            ]
        });
        res.status(200).json({users})
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
}

export const setRoleUser = async (req, res = response) => {
    const { id } = req.params;
    const { role } = req.body;
    try {
        await Profile.update(
            {roleId: role},
            {where: {id_profile: id}}
        );
        res.status(200).json({ role, msg: 'Role updated successfully'});
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
}


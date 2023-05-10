import { response } from "express";
import { Role } from "../models/Role.js";

export const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.findAll();
        res.status(200).json({ roles });
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const getRole = async (req, res) => {
    const { id } = req.params;
    try {
        const role = await Role.findOne({where: { id_role: id}});
        res.status(200).json({ data: role});
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const createRole = async (req, res = response) => {
    const { roleDescription } = req.body;

    try {
        const role = await Role.create({ role_description: roleDescription }, {
            returning: true
        });

        res.status(200).json({role});
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const deleteRole = async (req, res = response) => {
    const { idRole } = req.params;

    try {
        await Role.destroy({
            where: {id_role: idRole}
        });

        res.status(200).json({
            msg: "Role deleted"
        });
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const updateRole = async (req, res = response) => {
    const { idRole } = req.params;
    const {roleDescription} = req.body;

    try {
        const role = await Role.update({
            role_description: roleDescription
        }, {
            where: { id_role: idRole },
            returning: true,
        });

        res.status(200).json({role});
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};
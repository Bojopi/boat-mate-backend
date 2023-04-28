import { Role } from "../models/Role.js";

export const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.findAll();
        res.status(200).json({ roles });
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
}

export const getRole = async (req, res) => {
    const { id } = req.params;
    try {
        const role = await Role.findOne({where: { id_role: id}});
        res.status(200).json({ data: role});
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
}


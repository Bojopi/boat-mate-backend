import { Profile } from "../models/Profile.js";

export const setRoleUser = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    try {
        await Profile.update(
            {roleId: role},
            {where: {id_profile: id}}
        );
        res.status(200).json({ role, msg: 'Role updated successfully'});
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}


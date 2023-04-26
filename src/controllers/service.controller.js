
import { Service } from "../models/Service.js";

export const getAllServices = async (req, res) => {
    try {
        const services = await Service.findAll({
            order: [['service_name', 'ASC']]
        });
        res.status(200).json({ services });
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
}


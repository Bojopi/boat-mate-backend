import { Category } from "../models/Category.js";

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            order: [['category_name', 'ASC']]
        });
        res.status(200).json({ categories });
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
}


import { response } from "express";
import { Category } from "../models/Category.js";
import { ServiceCategories } from "../models/ServiceCategories.js";
import { Service } from "../models/Service.js";

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            order: [['category_name', 'ASC']]
        });
        res.status(200).json({ categories });
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const getOneCategory = async (req, res = response) => {
    const {idCategory} = req.params;

    try {
        const category = await Category.findOne({
            where: {id_category: idCategory}
        });

        res.status(200).json({category});
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const createCategory = async (req, res = response) => {
    const {categoryName} = req.body;

    try {
        const category = await Category.create({
            category_name: categoryName
        }, {
            returning: true
        });

        res.status(200).json(category);
    } catch (error) {
        return res.status(400).json({msg: error.message})
    }
}

export const updateCategory = async (req, res = response) => {
    const {idCategory} = req.params;
    const {categoryName} = req.body;

    try {
        const category = await Category.update({
            category_name: categoryName
        }, {
            where: {id_category: idCategory},
            returning: true,
            plain: true
        });

        res.status(200).json({
            msg: "Category Updated Successfully",
            category
        });
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const deleteCategory = async (req, res = response) => {
    const {idCategory} = req.params;

    try {
        await Category.destroy({
            where: {id_category: idCategory}
        });

        res.status(200).json({
            msg: "Category Deleted Successfully"
        });
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const getServicesCategory = async (req, res = response) => {
    const {idCategory} = req.params;

    try {
        const services = await ServiceCategories.findAll({
            where: {categoryIdCategory: idCategory},
            include: [Service]
        });

        res.status(200).json({services});
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};
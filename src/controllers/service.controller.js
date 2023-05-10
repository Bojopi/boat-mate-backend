
import e, { response } from "express";
import { Service } from "../models/Service.js";
import { sequelize } from "../database/database.js";
import { ServiceCategories } from "../models/ServiceCategories.js";
import { Category } from "../models/Category.js";
import { Op } from "sequelize";
import { Provider } from "../models/Provider.js";
import { ServiceProviders } from "../models/ServiceProviders.js";

export const getAllServices = async (req, res) => {
    try {
        const services = await Service.findAll({
            order: [['service_name', 'ASC']]
        });
        res.status(200).json({ services });
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const getOneService = async (req, res = response) => {
    const {idService} = req.params;

    try {
        const service = await Service.findOne({
            where: {id_service: idService}
        });

        res.status(200).json({ service });
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const updateService = async (req, res = response) => {
    const {idService} = req.params;
    const {serviceName, serviceDescription, idCategory} = req.body;

    let dataService = {};

    if(serviceName != null && serviceName != '') dataService.service_name = serviceName;
    if(serviceDescription != null && serviceDescription != '') dataService.service_description = serviceDescription;

    try {
        const service = await sequelize.transaction(async (t) => {
            if(idCategory != null && idCategory != '') {
                await ServiceCategories.update({
                    categoryIdCategory: idCategory
                }, {
                    where: {serviceIdService: idService},
                    transaction: t
                });
            }

            await Service.update(dataService, {
                where: {id_service: idService},
                transaction: t
            });

            const result = await Service.findOne({
                where: {id_service: idService},
                include: [{
                    model: ServiceCategories,
                    attributes: ['categoryIdCategory'],
                    include: [{
                        model: Category
                    }]
                }],
                transaction: t
            });

            return result;
        });

        res.status(200).json({service});
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const addCategory = async (req, res = response) => {
    const {idService} = req.params;
    const {idCategory} = req.body;

    try {
        await ServiceCategories.create({
            serviceIdService: idService,
            categoryIdCategory: idCategory
        });

        res.status(200).json({
            msg: 'Category added successfully!'
        });
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const deleteCategory = async (req, res = response) => {
    const {idService} = req.params;
    const {idCategory} = req.body;

    try {
        await ServiceCategories.destroy({
            where: {
                [Op.and]: [
                    {serviceIdService: idService},
                    {categoryIdCategory: idCategory}
                ]
            }
        });

        res.status(200).json({
            msg: 'Category deleted successfully!'
        });
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const getCategoriesService = async (req, res = response) => {
    const {idService} = req.params;

    try {
        const categories = await ServiceCategories.findAll({
            where: {serviceIdService: idService},
            include: [{
                model: Category,
            }]
        });

        res.status(200).json({categories});
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const getProvidersService = async (req, res = response) => {
    const {idService} = req.params;

    try {
        const providers = await ServiceProviders.findAll({
            where: {serviceIdService: idService},
            include: [{
                model: Provider
            }]
        });

        res.status(200).json({providers});
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const deleteService = async (req, res = response) => {
    const {idService} = req.params;

    try {
        await Service.destroy({
            where: {id_service: idService}
        });

        res.status(200).json({
            msg: 'Service deleted successfully!'
        });
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const createService = async (req, res = response) => {
    const {serviceName, serviceDescription} = req.body;

    try {
        const service = await Service.create({
            service_name: serviceName,
            service_description: serviceDescription
        }, {
            returning: true
        });

        res.status(200).json({service});
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};
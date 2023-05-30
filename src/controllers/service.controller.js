
import { response } from "express";
import { Service } from "../models/Service.js";
import { ServiceCategories } from "../models/ServiceCategories.js";
import { Category } from "../models/Category.js";
import { Op } from "sequelize";
import { Provider } from "../models/Provider.js";
import { ServiceProviders } from "../models/ServiceProviders.js";

export const getAllServices = async (req, res) => {
    try {
        const services = await Service.findAll({
            include: [{
                model: ServiceCategories,
                attributes: ['categoryIdCategory'],
                include: [{
                    model: Category,
                }]
            }],
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
            where: {id_service: idService},
            include: [{
                model: ServiceCategories,
                attributes: ['categoryIdCategory'],
                include: [{
                    model: Category,
                }]
            }]
        });

        res.status(200).json({ service });
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const findByNameService = async (req, res = response) => {
    const {name} = req.body;

    try {
        const service = await Service.findOne({
            where: {
                service_name: { [Op.iLike]: name }
            },
            include: [{
                model: ServiceProviders,
                include: [{
                    model: Provider,
                }]
            }]
        });

        res.status(200).json({ service });
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const createService = async (req, res = response) => {
    const { serviceName, serviceDescription, categories } = req.body;

    try {
        let service;
        service = await Service.create({
            service_name: serviceName,
            service_description: serviceDescription
        }, {
            returning: true
        });

        if(categories.length > 0) {
            const categoriesId = categories.map((category) => category.id_category);

            const existingCategory = await Category.findAll({
                where: { id_category: { [Op.in]: categoriesId } }
            });

            await service.setCategories(existingCategory);
        } else {
            await service.setCategories([]);
        }

        service = await Service.findOne({
            where: {id_service: service.id_service},
            include: [{
                model: ServiceCategories,
                attributes: ['categoryIdCategory'],
                include: [{
                    model: Category,
                }]
            }],
        });

        res.status(200).json({
            msg: 'Service successfully created',
            service
        });
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const updateService = async (req, res = response) => {
    const {idService} = req.params;
    const {serviceName, serviceDescription, categories} = req.body;

    let dataService = {};

    if(serviceName != null && serviceName != '') dataService.service_name = serviceName;
    if(serviceDescription != null && serviceDescription != '') dataService.service_description = serviceDescription;

    try {
        await Service.update(dataService, {
            where: {id_service: idService}
        });

        const serviceUpdate = await Service.findOne({
            where: {id_service: idService}
        });

        if(categories.length > 0) {
            const categoriesId = categories.map((category) => category.id_category);

            const existingCategory = await Category.findAll({
                where: { id_category: { [Op.in]: categoriesId } }
            });

            await serviceUpdate.setCategories(existingCategory);
        } else {
            await serviceUpdate.setCategories([]);
        }

        const service = await Service.findOne({
            where: {id_service: idService},
            include: [{
                model: ServiceCategories,
                attributes: ['categoryIdCategory'],
                include: [{
                    model: Category,
                }]
            }],
        });

        res.status(200).json({
            msg: 'Service successfully updated',
            service
        });
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
        const service = await Service.update({
            service_state: false
        }, {
            where: {id_service: idService},
            returning: ['service_state']
        });

        res.status(200).json({
            msg: 'Service deleted successfully!',
            service
        });
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const activateService = async (req, res = response) => {
    const {idService} = req.params;

    try {
        const service = await Service.update({
            service_state: true
        }, {
            where: {id_service: idService},
            returning: ['service_state']
        });

        res.status(200).json({msg: 'Successfully activated', service});
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};
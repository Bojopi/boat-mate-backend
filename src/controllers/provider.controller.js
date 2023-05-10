import { response } from "express";
import { Person } from "../models/Person.js";
import { Profile } from "../models/Profile.js";
import { Provider } from "../models/Provider.js";
import { ServiceProviders } from "../models/ServiceProviders.js";
import { Service } from "../models/Service.js";
import { Op } from "sequelize";

export const getAllProviders = async (req, res = response) => {
    try {
        const providers = await Provider.findAll({
            attributes: [
                'id_provider', 
                'provider_name', 
                'provider_description', 
                'zip', 
                'provider_lat',
                'provider_lng',
                'provider_image', 
                'profile.email', 
                'profile.person.phone'],
            include: {
                model: Profile,
                where: {profile_state: true},
                attributes: [],
                include: {
                    model: Person,
                    attributes: []
                },
            },
            raw: true
        });
        res.status(200).json({ providers });
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const getProvider = async (req, res = response) => {
    const {idProvider} = req.params;

    try {
        const provider = await Provider.findOne({
            attributes: [
                'id_provider',
                'provider_name',
                'provider_image',
                'zip',
                'provider_description',
                'provider_lat',
                'provider_lng',
                'profile.email',
                'profile.person.phone'],
            where: {id_provider: idProvider},
            include: [{
                model: Profile,
                where: {profile_state: true},
                attributes: [],
                include: [{
                    model: Person,
                    attributes: []
                }]
            }],
            raw: true
        });

        res.status(200).json({provider});
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const getServicesProvider = async (req, res = response) => {
    const {idProvider} = req.params;

    try {
        const providers = await ServiceProviders.findAll({
            attributes: ['id_service_provider', 'price', 'service.id_service', 'service.service_name', 'service.service_description'],
            where: {providerIdProvider: idProvider},
            include: [{
                model: Service,
                attributes: []
            }],
            raw: true
        });

        res.status(200).json({providers});
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const addService = async (req, res = response) => {
    const {idProvider} = req.params;
    const {idService, price} = req.body;

    try {
        const providerService = await ServiceProviders.create({
            providerIdProvider: idProvider,
            serviceIdService: idService,
            price: price
        }, {
            returning: true
        });

        res.status(200).json({providerService});
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const deleteService = async (req, res = response) => {
    const {idProvider} = req.params;
    const {idService} = req.body;

    try {
        await ServiceProviders.destroy({
            where: {
                [Op.and]: [
                    {providerIdProvider: idProvider},
                    {serviceIdService: idService}
                ]
            }
        });

        res.status(200).json({
            msg: 'Service deleted'
        });
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};


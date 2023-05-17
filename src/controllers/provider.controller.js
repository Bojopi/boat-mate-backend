import { response } from "express";
import { Person } from "../models/Person.js";
import { Profile } from "../models/Profile.js";
import { Provider } from "../models/Provider.js";
import { ServiceProviders } from "../models/ServiceProviders.js";
import { Service } from "../models/Service.js";
import { Op } from "sequelize";
import { deleteImage, uploadImage } from "../utils/cloudinary.js";
import fs from 'fs'
import path from "path";
import { sequelize } from "../database/database.js";

export const getAllProviders = async (req, res = response) => {
    try {
        const providers = await Provider.findAll({
            attributes: [
                'id_provider',
                'provider_name',
                'provider_description',
                'provider_lat',
                'provider_lng',
                'provider_image',
                'profile.id_profile',
                'profile.email',
                'profile.profile_state',
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
                'provider_description',
                'provider_lat',
                'provider_lng',
                'profile.id_profile',
                'profile.email',
                'profile.profile_state',
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

export const updateProvider = async (req, res = response) => {
    const {idProvider} = req.params;

    const {
        lat,
        lng,
        providerName,
        providerDescription,
        phone,
        email
    } = req.body;

    let providerImage;
    if(req.files != null) {
        const {providerImage: provImg} = req.files;
        providerImage = provImg;
    };

    let dataUpdate = {};

    if(lat != null && lat != '') dataUpdate.provider_lat = lat;
    if(lng != null && lng != '') dataUpdate.provider_lng = lng;
    if(providerName != null && providerName != '') dataUpdate.provider_name = providerName;
    if(providerDescription != null && providerDescription != '') dataUpdate.provider_description = providerDescription;
    if(phone != null && phone != '') dataUpdate.phone = phone;
    if(email != null && email != '') dataUpdate.email = email;

    try {
        await sequelize.transaction(async (t) => {
            const {provider_image, profileId, profile: {person: {id_person}}} = await Provider.findOne({
                where: {id_provider: idProvider},
                include: [{
                    model: Profile,
                    include: [{
                        model: Person
                    }]
                }],
                transaction: t
            })
            if(providerImage != null && providerImage != undefined && provider_image != null && provider_image != '') {
                const resDelete = await deleteImage(provider_image);
                if(resDelete) {
                    const result = await uploadImage(providerImage.tempFilePath);
                    dataUpdate.provider_image = result.secure_url;
                    fs.unlinkSync(path.join(providerImage.tempFilePath));
                }
            } else if(providerImage != null && providerImage != undefined) {
                const result = await uploadImage(providerImage.tempFilePath);
                dataUpdate.provider_image = result.secure_url;
                fs.unlinkSync(path.join(providerImage.tempFilePath));
            }
    
            await Provider.update(dataUpdate, {
                where: {id_provider: idProvider},
                transaction: t
            });

            await Profile.update(dataUpdate, {
                where: {id_profile: profileId}
            });

            await Person.update(dataUpdate, {
                where: {id_person: id_person}
            })

            const prov = await Provider.findOne({
                attributes: [
                    'id_provider',
                    'provider_name',
                    'provider_image',
                    'provider_description',
                    'provider_lat',
                    'provider_lng',
                    'profile.id_profile',
                    'profile.email',
                    'profile.profile_state',
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
                raw: true,
                transaction: t
            });

            return prov
        })

        res.status(200).json({
            msg: 'Provider successfully updated'
        })
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
}


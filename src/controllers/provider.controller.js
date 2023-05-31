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
import { verify } from "jsonwebtoken";

export const getAllProviders = async (req, res = response) => {
    const {tokenUser} = req.cookies;

    if(!tokenUser) {
        return res.status(401).json({msg: 'Unauthorized'});
    }
    try {
        let where = {}
        const user = verify(tokenUser, process.env.JWT_SECRET);
        if(user.role === 'CUSTOMER') {
            where = {profile_state: true}
        }
        const providers = await Provider.findAll({
            attributes: [
                'id_provider',
                'provider_name',
                'provider_description',
                'provider_lat',
                'provider_lng',
                'zip',
                'provider_image',
                'profile.id_profile',
                'profile.email',
                'profile.profile_state',
                'profile.person.phone',
                'profile.person.person_name',
                'profile.person.lastname'],
            include: {
                model: Profile,
                where: where,
                attributes: [],
                include: {
                    model: Person,
                    attributes: []
                }
            },
            order: [[Profile, 'profile_state', 'DESC']],
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
                'zip',
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
        const services = await ServiceProviders.findAll({
            attributes: [
                'id_service_provider',
                'service_provider_state',
                'service_provider_description',
                'service.id_service',
                'service.service_name',
            ],
            where: {
                [Op.and]: [
                    {providerIdProvider: idProvider},
                    {service_provider_state: true}
                ],
            },
            include: [{
                model: Service,
                attributes: []
            }],
            order: [[Service, 'service_name', 'ASC']],
            raw: true
        });

        res.status(200).json({services});
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const getServiceProvider = async (req, res = response) => {
    const {idProvider, idService} = req.params;

    try {
        const service = await ServiceProviders.findOne({
            attributes: [
                'id_service_provider',
                'service_provider_state',
                'service_provider_description',
                'service.id_service',
                'service.service_name',
            ],
            where: {
                [Op.and]: [
                    {providerIdProvider: idProvider},
                    {serviceIdService: idService},
                ],
            },
            include: [{
                model: Service,
                attributes: []
            }],
            raw: true
        });

        res.status(200).json({service});
    } catch (error) {
        return res.status(400).json({msg: error.message})
    }
}

export const addService = async (req, res = response) => {
    const {idProvider} = req.params;
    const {idService, description} = req.body;

    try {
        let data = { service_provider_state: true }
        if(description != null && description != '') data.service_provider_description = description;

        const serviceExists = await ServiceProviders.findOne({
            where: {
                [Op.and]: [
                    {providerIdProvider: idProvider},
                    {serviceIdService: idService}
                ]
            }
        })

        if(serviceExists) {
            await ServiceProviders.update(data,
            {
                where: {
                    [Op.and]: [
                        {providerIdProvider: idProvider},
                        {serviceIdService: idService}
                    ]
                }
            })

            const service = await ServiceProviders.findOne({
                attributes: [
                    'id_service_provider',
                    'service_provider_state',
                    'service_provider_description',
                    'service.id_service',
                    'service.service_name',
                ],
                where: {
                    [Op.and]: [
                        {providerIdProvider: idProvider},
                        {serviceIdService: idService}
                    ],
                },
                include: [{
                    model: Service,
                    attributes: []
                }],
                raw: true
            })

            return res.status(200).json({ service });
        }

        const service = await ServiceProviders.create({
            providerIdProvider: idProvider,
            serviceIdService: idService,
            ...data
        }, {
            returning: true
        });

        res.status(200).json({service});
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const updateService = async (req, res = response) => {
    const {idProvider, idService} = req.params;
    const {description} = req.body;

    try {
        const service_description = await ServiceProviders.update({
            service_provider_description: description
        }, {
            where: {
                [Op.and]: [
                    {providerIdProvider: idProvider},
                    {serviceIdService: idService}
                ]
            },
            returning: ['service_provider_description']
        });

        res.status(200).json({service_description})
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const deleteService = async (req, res = response) => {
    const {idProvider, idService} = req.params;

    try {
        await ServiceProviders.update({
            service_provider_state: false
        }, {
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
        zip,
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
    if(zip != null && zip != '') dataUpdate.zip = zip;
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
                    'zip',
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


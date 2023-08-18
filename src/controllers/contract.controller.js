import { response } from "express";
import { Contract } from "../models/Contract.js";
import { ServiceProviders } from "../models/ServiceProviders.js";
import { Provider } from "../models/Provider.js";
import { Service } from "../models/Service.js";
import { Customer } from "../models/Customer.js";
import { Profile } from "../models/Profile.js";
import { Person } from "../models/Person.js";

import { eventEmitter } from "../helpers/event-emitter.js";
import { sequelize } from "../database/database.js";

export const getContracts = async (req, res = response) => {
    try {

        const contracts = await Contract.findAll({
            attributes: [
                'id_contract',
                'contract_date',
                'contract_date_finished',
                'contract_state',
                'contract_description',
                'contract_price',
                'service_provider.id_service_provider',
                'service_provider.service_provider_state',
                'service_provider.provider.id_provider',
                'service_provider.provider.provider_name',
                'service_provider.service.id_service',
                'service_provider.service.service_name',
                'customer.id_customer',
                'customer.profile.email',
                'customer.profile.person.person_name',
                'customer.profile.person.lastname',
                'customer.profile.person.phone'
            ],
            include: [{
                model: ServiceProviders,
                attributes: [],
                include: [{
                    model: Provider,
                    attributes: []
                }, {
                    model: Service,
                    attributes: []
                }]
            }, {
                model: Customer,
                attributes: [],
                include: [{
                    model: Profile,
                    attributes: [],
                    include: [{
                        model: Person,
                        attributes: []
                    }]
                }]
            }],
            order: [['contract_date', 'DESC']],
            raw: true
        })
        res.status(200).json({ contracts });
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const getOneContract = async (req, res = response) => {
    const { idContract } = req.params;

    try {
        const contract = await Contract.findOne({
            attributes: [
                'id_contract',
                'contract_date',
                'contract_date_finished',
                'contract_state',
                'contract_description',
                'contract_price',
                'service_provider.id_service_provider',
                'service_provider.service_provider_state',
                'service_provider.provider.id_provider',
                'service_provider.provider.provider_name',
                'service_provider.service.id_service',
                'service_provider.service.service_name',
                'customer.id_customer',
                'customer.profile.email',
                'customer.profile.person.person_name',
                'customer.profile.person.lastname',
                'customer.profile.person.phone'
            ],
            where: {id_contract: idContract},
            include: [{
                model: ServiceProviders,
                attributes: [],
                include: [{
                    model: Provider,
                    attributes: []
                }, {
                    model: Service,
                    attributes: []
                }]
            }, {
                model: Customer,
                attributes: [],
                include: [{
                    model: Profile,
                    attributes: [],
                    include: [{
                        model: Person,
                        attributes: []
                    }]
                }]
            }],
            order: [['contract_date', 'DESC']],
            raw: true
        })
        res.status(200).json({ contract });
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const createContract = async (req, res = response) => {
    const {idCustomer} = req.params;

    const {
        idServiceProvider,
        date,
        contractDescription
    } = req.body;
    try {
        const contract = await Contract.create({
            customerId: parseInt(idCustomer),
            serviceProviderId: idServiceProvider,
            contract_date: date,
            contract_state: 'PENDING',
            contract_description: contractDescription,
        }, {
            returning: true
        });
        
        eventEmitter.emit('contract-create', {
            idCustomer: idCustomer,
            contract
        })

        res.status(200).json({
            msg: 'Contract created',
            contract
        });
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const updateContract = async (req, res = response) => {
    const {idContract} = req.params;
    const {price, contract_description, contract_state} = req.body;

    try {
        let dataUpdate = {};
        if(price != null && price != '' && price != 0) dataUpdate.contract_price = price;
        if(contract_description != null && contract_description != '') dataUpdate.contract_description = contract_description;
        if(contract_state != null && contract_state != '') dataUpdate.contract_state = contract_state;

        const contract = await Contract.update(dataUpdate, {
            where: {id_contract: idContract},
            returning: true
        });
        res.status(200).json({
            msg: 'Contract successfully updated',
            contract
        })
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const getContracsProvider = async (req, res = response) => {
    const {idProvider} = req.params;

    try {
        const contracts = await Contract.findAll({
            attributes: [
                'id_contract',
                'contract_date',
                'contract_date_finished',
                'contract_state',
                'contract_description',
                'contract_price',
                'service_provider.service_provider_state',
                'service_provider.service.service_name',
                'customer.profile.email',
                'customer.profile.person.person_name',
                'customer.profile.person.lastname',
                'customer.profile.person.phone',
                'customer.profile.person.person_image',
            ],
            include: [{
                model: ServiceProviders,
                attributes: [],
                where: {providerIdProvider: idProvider},
                include: [{
                    model: Service,
                    attributes: []
                }]
            }, {
                model: Customer,
                attributes: [],
                include: [{
                    model: Profile,
                    attributes: [],
                    include: [{
                        model: Person,
                        attributes: []
                    }]
                }]
            }],
            raw: true,
        });

        const count = await Contract.count({
            include: [{
                model: ServiceProviders,
                attributes: [],
                where: {providerIdProvider: idProvider}
            }, {
                model: Customer,
                attributes: [],
                include: [{
                    model: Profile,
                    attributes: [],
                    include: [{
                        model: Person,
                        attributes: []
                    }]
                }]
            }],
            raw: true,
        });

        res.status(200).json({contracts, count});
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const getContracsCustomer = async (req, res = response) => {
    const {idCustomer} = req.params;

    try {
        const contracts = await Contract.findAll({
            attributes: [
                'id_contract',
                'contract_date',
                'contract_date_finished',
                'contract_state',
                'contract_description',
                'contract_price',
                'service_provider.service_provider_state',
                'service_provider.service.service_name',
                'service_provider.provider.id_provider',
                'service_provider.provider.provider_name',
                'service_provider.provider.provider_lat',
                'service_provider.provider.provider_lng',
                'service_provider.provider.provider_zip',
                'service_provider.provider.provider_image',
                'service_provider.provider.profile.email',
                'service_provider.provider.profile.person.person_name',
                'service_provider.provider.profile.person.lastname',
                'service_provider.provider.profile.person.phone'
            ],
            where: {customerId: idCustomer},
            include: [{
                model: ServiceProviders,
                attributes: [],
                include: [{
                    model: Service,
                    attributes: []
                }, {
                    model: Provider,
                    attributes: [],
                    include: [{
                        model: Profile,
                        attributes: [],
                        include: [{
                            model: Person,
                            attributes: []
                        }]
                    }]
                }]
            }],
            order: [['contract_date', 'DESC']],
            raw: true,
        });

        const count = await Contract.count({
            where: {customerId: idCustomer},
            include: [{
                model: ServiceProviders,
                attributes: [],
                include: [{
                    model: Provider,
                    attributes: [],
                    include: [{
                        model: Profile,
                        attributes: [],
                        include: [{
                            model: Person,
                            attributes: []
                        }]
                    }]
                }]
            }],
            raw: true,
        });

        res.status(200).json({contracts, count});
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const updateState = async (req, res = response) => {
    const {idContract} = req.params;
    const {contractState, price, date} = req.body;

    let data = {};

    data = {...data, contract_state: contractState}

    if(price != 0 || price != null) {
        data = {...data, contract_price: price}
    }

    if(date != null) {
        data = {...data, contract_date_finished: date}
    }

    try {
        console.log(data)
        const contract = await Contract.update(
            data, {
            where: {id_contract: idContract},
            returning: true
        });

        res.status(200).json({
            msg: 'Contract updated',
            contract
        });
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const getHiredServices = async (req, res = response) => {

    // const page = Number(req.query.page)
    // const perPage = Number(req.query.perPage)

    try {
        const hireds = await Contract.findAll({
            attributes: [
                'id_contract',
                [sequelize.fn('COUNT', sequelize.col('id_contract')), 'contract_count'],
                'service_provider.service.id_service',
                'service_provider.service.service_name',
                'service_provider.service.service_description',
                'service_provider.service.service_image',
                // 'service_provider.provider.provider_lat',
                // 'service_provider.provider.provider_lng',
                // 'service_provider.provider.provider_zip',
            ],
            include: [{
                model: ServiceProviders,
                attributes: [],
                include: [{
                    model: Service,
                    where: {service_state: true},
                    attributes: []
                }, {
                    model: Provider,
                    attributes: []
                }]
            }],
            group: [
                'service_provider.service.id_service', 
                'contracts.id_contract',
                'service_provider.service.service_name',
                'service_provider.service.service_description',
                'service_provider.service.service_image',
                // 'service_provider.provider.provider_lat',
                // 'service_provider.provider.provider_lng',
                // 'service_provider.provider.provider_zip',
            ],
            order: [sequelize.col('service_provider.service.id_service')],
            // limit: perPage,
            // offset: (page - 1) * perPage,
            raw: true,
        });

        // const totalItems = hireds.count;
        // const totalPages = Math.ceil(totalItems / perPage);

        res.status(200).json({hireds});
        // res.status(200).json({hireds: hireds.rows, totalItems, totalPages});
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};


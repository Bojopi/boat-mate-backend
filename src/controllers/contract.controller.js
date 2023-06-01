import { response } from "express";
import { Contract } from "../models/Contract.js";
import { ServiceProviders } from "../models/ServiceProviders.js";
import { Provider } from "../models/Provider.js";
import { Service } from "../models/Service.js";
import { Customer } from "../models/Customer.js";
import { Profile } from "../models/Profile.js";
import { Person } from "../models/Person.js";

export const getContracts = async (req, res = response) => {
    try {

        const contracts = await Contract.findAll({
            attributes: [
                'id_contract',
                'contract_date',
                'contract_state',
                'contract_description',
                'price',
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
                'contract_state',
                'contract_description',
                'price',
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
        contractDescription,
    } = req.body;

    try {
        const contract = await Contract.create({
            customerIdCustomer: idCustomer,
            serviceProviderIdServiceProvider: idServiceProvider,
            contract_date: date,
            contract_state: 'PENDING',
            contract_description: contractDescription
        }, {
            returning: true
        });

        res.status(200).json({contract});
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const updateContract = async (req, res = response) => {
    const {idContract} = req.params;
    const {price, contract_description, contract_state} = req.body;

    try {
        let dataUpdate = {};
        if(price != null && price != '' && price != 0) dataUpdate.price = price;
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
                'contract_state',
                'contract_description',
                'price',
                'service_provider.service_provider_state',
                'customer.profile.email',
                'customer.profile.person.person_name',
                'customer.profile.person.lastname',
                'customer.profile.person.phone'
            ],
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

export const updateState = async (req, res = response) => {
    const {idContract} = req.params;
    const {contractState} = req.body;

    try {
        const contract = await Contract.update({
            contract_state: contractState
        }, {
            where: {id_contract: idContract},
            returning: true
        });

        res.status(200).json({contract});
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};


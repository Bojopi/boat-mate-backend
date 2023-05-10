import { response } from "express";
import { Contract } from "../models/Contract.js";
import { Customer } from "../models/Customer.js";
import { Person } from "../models/Person.js";
import { Profile } from "../models/Profile.js";
import { Provider } from "../models/Provider.js";
import { ServiceProviders } from "../models/ServiceProviders.js";

export const getServiceHistory = async (req, res = response) => {
    try {

        const serviceHistory = await Contract.findAll({
            attributes: [
                'id_contract',
                'date',
                'contract_state',
                'contract_description',
                'service_provider.id_service_provider',
                'service_provider.price',
                'service_provider.provider.id_provider',
                'service_provider.provider.provider_name',
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
            order: [['date', 'DESC']],
            raw: true
        })
        res.status(200).json({ serviceHistory });
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
            date: date,
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

export const getCustomers = async (req, res = response) => {
    try {
        const customers = await Customer.findAll({
            attributes: [
                'id_customer',
                'customer_lat',
                'customer_lng',
                'profile.email',
                'profile.person.person_name',
                'profile.person.lastname',
                'profile.person.phone'
            ],
            include: [{
                model: Profile,
                attributes: [],
                include: [{
                    model: Person,
                    attributes: []
                }]
            }],
            raw: true
        });

        res.status(200).json({customers});
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const getCustomer = async (req, res = response) => {
    const {idCustomer} = req.params;

    try {
        const customer = await Customer.findOne({
            where: {id_customer: idCustomer},
            attributes: [
                'id_customer',
                'customer_lat',
                'customer_lng',
                'profile.email',
                'profile.person.person_name',
                'profile.person.lastname',
                'profile.person.phone'
            ],
            include: [{
                model: Profile,
                attributes: [],
                include: [{
                    model: Person,
                    attributes: []
                }]
            }],
            raw: true
        });

        res.status(200).json({customer});
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
                'date',
                'contract_state',
                'contract_description',
                'service_provider.price',
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
            raw: true
        });

        res.status(200).json({contracts});
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


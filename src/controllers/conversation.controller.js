import { response } from "express";
import { Rating } from "../models/Rating.js";
import { ServiceProviders } from "../models/ServiceProviders.js";
import { Provider } from "../models/Provider.js";
import { Customer } from "../models/Customer.js";
import { Person } from "../models/Person.js";
import { Profile } from "../models/Profile.js";
import { Service } from "../models/Service.js";
import { Message } from "../models/Message.js";
import { sequelize } from "../database/database.js";
import { Conversation } from "../models/Conversation.js";
import { Contract } from "../models/Contract.js";
import { io } from '../index.js'

export const createMessage = async (req, res = response) => {
    const {idContract} = req.params;
    const {messageText, date, providerId, customerId} = req.body;

    const data = {
        message_text: messageText,
        message_date: date,
    };
    if(providerId) data['providerId'] = providerId
    else if(customerId) data['customerId'] = customerId

    try {
        await sequelize.transaction(async (t) => {
            let message;
            let idConversation;

            const conversation = await Conversation.findOne({
                where: { contractId: idContract },
                transaction : t
            });

            if(conversation) {
                message = await Message.create({
                    ...data,
                    conversationId: conversation.id_conversation
                }, {
                    returning: true,
                    transaction: t
                })
            } else {
                const conversation = await Conversation.create({
                    contractId: idContract
                }, {
                    returning: true,
                    transaction: t
                })

                idConversation = conversation[0].id_conversation

                message = await Message.create({
                    ...data,
                    conversationId: conversation[0].id_conversation
                }, {
                        returning: true,
                        transaction: t
                })
            }

            // io.to(idConversation).emit('message', message);

            res.status(200).json({
                msg: 'Message send',
                message
            });

        })

    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const getConversation = async (req, res = response) => {
    const {idContract} = req.params;

    try {
        await sequelize.transaction(async (t) => {
            const conversation = await Conversation.findOne({
                // attributes: [
                //     'id_conversation',
                //     'conversation_state',
                //     'contract.id_contract',
                //     'contract.contract_date',
                //     'contract.contract_state',
                //     'contract.contract_description',
                //     'contract.contract_price',
                //     'contract.contract_date_finished',
                //     'contract.service_provider.service_provider_state',
                //     'contract.service_provider.service.service_name',
                //     'contract.service_provider.provider.id_provider',
                //     'contract.service_provider.provider.provider_name',
                //     'contract.service_provider.provider.provider_lat',
                //     'contract.service_provider.provider.provider_lng',
                //     'contract.service_provider.provider.provider_zip',
                //     'contract.service_provider.provider.provider_image',
                //     'contract.service_provider.provider.profile.email',
                //     'contract.service_provider.provider.profile.person.person_name',
                //     'contract.service_provider.provider.profile.person.lastname',
                //     'contract.service_provider.provider.profile.person.phone'
                // ],
                where: {contractId: idContract},
                // include: [{
                //     model: Contract,
                //     attributes: [],
                //     include: [{
                //         model: ServiceProviders,
                //         attributes: [],
                //         include: [{
                //             model: Service,
                //             attributes: []
                //         }, {
                //             model: Provider,
                //             attributes: []
                //         }]
                //     }]
                // }],
                transaction: t
            });

            let messages;
            if(conversation) {
                messages = await Message.findAll({
                    attributes: [
                        'id_message',
                        'message_text',
                        'message_date',
                        'message_read',
                        'provider.id_provider',
                        'provider.provider_name',
                        'provider.provider_image',
                        'customer.id_customer',
                        'customer.profile.person.person_name',
                        'customer.profile.person.lastname',
                    ],
                    where: {conversationId: conversation.id_conversation},
                    include: [{
                        model: Provider,
                        attributes: []
                    }, {
                        model: Customer,
                        attributes: [],
                        include: [{
                            model: Profile,
                            attributes: [],
                            include:[{
                                model: Person,
                                attributes: []
                            }]
                        }]
                    }],
                    order: [['message_date', 'ASC']],
                    raw: true,
                    transaction: t
                })
            }

            res.status(200).json({conversation, messages});
        })

    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const getConversationsCustomer = async (req, res = response) => {
    const { idCustomer } = req.params;

    try {
        const contracts = await Contract.findAll({
            where: {customerId: idCustomer},
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
            raw: true,
        });

        const conversationsByContract = [];

        for (const contract of contracts) {
            const conversations = await Conversation.findAll({
                where: { contractId: contract.id_contract }
            });

            for (const conversation of conversations) {
                const messages = await Message.findAll({
                    where: {conversationId: conversation.id_conversation},
                    attributes: [
                        'id_message',
                        'message_text',
                        'message_date',
                        'message_read',
                        'provider.id_provider',
                        'provider.provider_name',
                        'provider.provider_image',
                        'customer.id_customer',
                        'customer.profile.person.person_name',
                        'customer.profile.person.lastname',
                    ],
                    include: [{
                        model: Provider,
                        attributes: []
                    }, {
                        model: Customer,
                        attributes: [],
                        include: [{
                            model: Profile,
                            attributes: [],
                            include:[{
                                model: Person,
                                attributes: []
                            }]
                        }]
                    }],
                    order: [['message_date', 'ASC']],
                    raw: true,
                })

                conversationsByContract.push({
                    contract,
                    conversations,
                    messages
                });
            }
        }

        return res.status(200).json({
            conversationsByContract
        })
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
}

export const getConversationsProvider = async (req, res = response) => {
    const { idProvider } = req.params;

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

        const conversationsByContract = [];

        for (const contract of contracts) {
            const conversations = await Conversation.findAll({
                where: { contractId: contract.id_contract }
            });

            for (const conversation of conversations) {
                const messages = await Message.findAll({
                    where: {conversationId: conversation.id_conversation},
                    attributes: [
                        'id_message',
                        'message_text',
                        'message_date',
                        'message_read',
                        'provider.id_provider',
                        'provider.provider_name',
                        'provider.provider_image',
                        'customer.id_customer',
                        'customer.profile.person.person_name',
                        'customer.profile.person.lastname',
                    ],
                    include: [{
                        model: Provider,
                        attributes: []
                    }, {
                        model: Customer,
                        attributes: [],
                        include: [{
                            model: Profile,
                            attributes: [],
                            include:[{
                                model: Person,
                                attributes: []
                            }]
                        }]
                    }],
                    order: [['message_date', 'ASC']],
                    raw: true,
                })

                conversationsByContract.push({
                    contract,
                    conversations,
                    messages
                });
            }
        }

        return res.status(200).json({
            conversationsByContract
        })
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
}

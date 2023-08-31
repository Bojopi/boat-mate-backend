import { response } from "express";
import { Provider } from "../models/Provider.js";
import { Customer } from "../models/Customer.js";
import { Person } from "../models/Person.js";
import { Profile } from "../models/Profile.js";
import { Message } from "../models/Message.js";
import { sequelize } from "../database/database.js";
import { Conversation } from "../models/Conversation.js";
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

            // io.emit('message', message);

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
                where: {contractId: idContract},
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
                        'providerId',
                        'customerId',
                        // 'provider.id_provider',
                        'provider.provider_name',
                        'provider.provider_image',
                        // 'customer.id_customer',
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

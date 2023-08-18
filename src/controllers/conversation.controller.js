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

                message = await Message.create({
                    ...data,
                    conversationId: conversation[0].id_conversation
                }, {
                        returning: true,
                        transaction: t
                })
            }

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
                attributes: [
                    'id_conversation',
                    'conversation_state',
                    'contract.id_contract',
                    'contract.contract_description',
                    'contract.contract_state',
                    'contract.contract_date',
                    'contract.contract_price',
                    'contract.customer.profile.email',
                    'contract.customer.profile.person.person_name',
                    'contract.customer.profile.person.lastname',
                    'contract.customer.profile.person.phone',
                ],
                where: {contractId: idContract},
                include: [{
                    model: Contract,
                    attributes: [],
                    include: [{
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
                    }]
                }],
                raw: true,
                transaction: t
            });

            let messages;
            if(conversation) {
                messages = await Message.findAll({
                    where: {conversationId: conversation.id_conversation},
                    transaction: t
                })
            }

            res.status(200).json({conversation, messages});
        })

    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

// export const getCustomersPost = async (req, res = response) => {
//     const {idCustomer} = req.params;

//     try {
//         const ratings = await Rating.findAll({
//             where: {customerId: idCustomer}
//         });

//         res.status(200).json({ratings});
//     } catch (error) {
//         return res.status(400).json({msg: error.message});
//     }
// };

// export const getRatingProvider = async (req, res = response) => {

//     const {idProvider} = req.params;

//     try {
//         const rating = await Rating.findAll({
//             attributes: [
//                 'id_rating',
//                 'rating',
//                 'review',
//                 'rating_date',
//                 'provider_visible',
//                 'service_provider.id_service_provider',
//                 'service_provider.service_provider_description',
//                 'service_provider.provider.id_provider',
//                 'service_provider.provider.provider_name',
//                 'service_provider.provider.provider_image',
//                 'service_provider.service.id_service',
//                 'service_provider.service.service_name',
//                 'customer.id_customer',
//                 'customer.profile.email',
//                 'customer.profile.person.person_name',
//                 'customer.profile.person.lastname',
//                 'customer.profile.person.phone',
//                 'customer.profile.person.person_image',
//             ],
//             include: [{
//                 model: ServiceProviders,
//                 attributes: [],
//                 where: {providerIdProvider: idProvider},
//                 include: [{
//                     model: Provider,
//                     attributes: []
//                 }, {
//                     model: Service,
//                     attributes: []
//                 }]
//             }, {
//                 model: Customer,
//                 attributes: [],
//                 include: [{
//                     model: Profile,
//                     attributes: [],
//                     include: [{
//                         model: Person,
//                         attributes: []
//                     }]
//                 }]
//             }],
//             order: [['rating_date', 'DESC']],
//             raw: true
//         })

//         const countRating = await Rating.count({
//             include: [{
//                 model: ServiceProviders,
//                 attributes: [],
//                 where: {providerIdProvider: idProvider},
//                 include: [{
//                     model: Provider,
//                     attributes: []
//                 }, {
//                     model: Service,
//                     attributes: []
//                 }]
//             }, {
//                 model: Customer,
//                 attributes: [],
//                 include: [{
//                     model: Profile,
//                     attributes: [],
//                     include: [{
//                         model: Person,
//                         attributes: []
//                     }]
//                 }]
//             }]
//         })
//         res.status(200).json({ countRating, rating });
//     } catch (error) {
//         return res.status(400).json({msg: error.message});
//     }
// };

// export const postRating = async (req, res = response) => {
//     const {idCustomer} = req.params;
//     const {
//         idServiceProvider,
//         rating: ratingNew,
//         review
//     } = req.body;

//     try {
//         const {id_rating} = await Rating.create({
//             rating: ratingNew,
//             review: review,
//             customerId: idCustomer,
//             serviceProviderId: idServiceProvider
//         });

//         const rating = await Rating.findOne({
//             attributes: [
//                 'id_rating',
//                 'rating',
//                 'review',
//                 'rating_date',
//                 'provider_visible',
//                 'service_provider.id_service_provider',
//                 'service_provider.service_provider_description',
//                 'service_provider.provider.id_provider',
//                 'service_provider.provider.provider_name',
//                 'service_provider.provider.provider_image',
//                 'service_provider.service.id_service',
//                 'service_provider.service.service_name',
//                 'customer.id_customer',
//                 'customer.profile.email',
//                 'customer.profile.person.person_name',
//                 'customer.profile.person.lastname',
//                 'customer.profile.person.phone',
//                 'customer.profile.person.person_image',
//             ],
//             where: {id_rating: id_rating},
//             include: [{
//                 model: ServiceProviders,
//                 attributes: [],
//                 include: [{
//                     model: Provider,
//                     attributes: []
//                 }, {
//                     model: Service,
//                     attributes: []
//                 }]
//             }, {
//                 model: Customer,
//                 attributes: [],
//                 include: [{
//                     model: Profile,
//                     attributes: [],
//                     include: [{
//                         model: Person,
//                         attributes: []
//                     }]
//                 }]
//             }],
//             raw: true
//         });

//         res.status(200).json({
//             msg: 'Review successfully created',
//             rating
//         });
//     } catch (error) {
//         return res.status(400).json({msg: error.message});
//     }
// };

// export const updateRating = async (req, res = response) => {
//     const {idRating} = req.params;
//     const {rating, review} = req.body;

//     let dataRating = {}

//     if(rating != null && rating != "") dataRating.rating = rating;
//     if(review != null && review != "") dataRating.review = review;

//     try {
//         const rating = await Rating.update(dataRating, {
//             where: {id_rating: idRating},
//             returning: true
//         });

//         res.status(200).json({rating});
//     } catch (error) {
//         return res.status(400).json({msg: error.message});
//     }
// };

// export const changeVisible = async (req, res = response) => {
//     const {idRating} = req.params;
//     const {provider_visible} = req.body;

//     try {
//         const rating  = await Rating.update({
//             provider_visible: provider_visible
//         }, {
//             where: {id_rating: idRating},
//             returning: ['provider_visible']
//         });

//         res.status(200).json({
//             msg: provider_visible ? 'Rating visible!' : 'Rating hidden!',
//             rating
//         });
//     } catch (error) {
//         return res.status(400).json({msg: error.message});
//     }
// };


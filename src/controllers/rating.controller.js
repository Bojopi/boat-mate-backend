import { response } from "express";
import { Rating } from "../models/Rating.js";
import { ServiceProviders } from "../models/ServiceProviders.js";
import { Sequelize } from "sequelize";
import { Provider } from "../models/Provider.js";

export const getAllRatings = async (req, res = response) => {
    try {
        const ratings = await Rating.findAll();

        res.status(200).json({ratings});
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const getOneRating = async (req, res = response) => {
    const {idRating} = req.params;

    try {
        const rating = await Rating.findOne({
            where: {id_rating: idRating}
        });

        res.status(200).json({rating});
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const getCustomersPost = async (req, res = response) => {
    const {idCustomer} = req.params;

    try {
        const ratings = await Rating.findAll({
            where: {customerId: idCustomer}
        });

        res.status(200).json({ratings});
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const getRatingProvider = async (req, res = response) => {

    const {idProvider} = req.params;

    try {
        const rating = await Provider.findAll({
            attributes: [[Sequelize.fn('AVG', Sequelize.col('service_providers.ratings.rating')), 'averageRating']],
            where: {id_provider: idProvider},
            include: [{
                model: ServiceProviders,
                attributes: [],
                include: [{
                    model: Rating,
                    attributes: []
                }]
            }],
            group: ['id_provider']
        })
        res.status(200).json({ rating });
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const postRating = async (req, res = response) => {
    const {idCustomer} = req.params;
    const {
        idServiceProvider,
        rating,
        review
    } = req.body;

    try {
        const post = await Rating.create({
            rating: rating,
            review: review,
            customerId: idCustomer,
            serviceProviderId: idServiceProvider
        }, {
            returning: true
        });

        res.status(200).json({post});
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const updateRating = async (req, res = response) => {
    const {idRating} = req.params;
    const {rating, review} = req.body;

    let dataRating = {}

    if(rating != null && rating != "") dataRating.rating = rating;
    if(review != null && review != "") dataRating.review = review;

    try {
        const ratingUpdated = await Rating.update(dataRating, {
            where: {id_rating: idRating},
            returning: true
        });

        res.status(200).json({ratingUpdated});
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const deleteRating = async (req, res = response) => {
    const {idRating} = req.params;

    try {
        await Rating.destroy({
            where: {id_rating: idRating}
        });

        res.status(200).json({
            msg: 'Rating deleted successfully!'
        });
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};


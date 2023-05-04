import { response } from "express";
import { Rating } from "../models/Rating.js";
import { ServiceProviders } from "../models/ServiceProviders.js";
import { Sequelize } from "sequelize";
import { Provider } from "../models/Provider.js";

export const getRatingProvider = async (req, res = response) => {

    const {id_provider} = req.params;

    try {
        const rating = await Provider.findAll({
            attributes: [[Sequelize.fn('AVG', Sequelize.col('service_providers.ratings.rating')), 'averageRating']],
            where: {id_provider},
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
}


import { response } from "express";
import { uploadImages } from "../utils/cloudinary.js";
import { Portofolio } from "../models/Portofolio.js";

export const uploadPortofolio = async (req, res = response) => {
    const { images } = req.files;

    const { idProvider } = req.params;

    try {
        const response = await uploadImages(idProvider, images);

        await Portofolio.bulkCreate(response);

        res.status(200).json({msg: 'images uploaded'})
    } catch (error) {
        res.status(401).json({msg: error.message})
    }

}

export const getPortofolio = async (req, res = response) => {
    const { idProvider } = req.params;
    
    try {
        const response = await Portofolio.findAll({
            where: {providerId: idProvider}
        });

        res.status(200).json({response});
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const updatePortofolio = async (req, res = response) => {
    const { idPortofolio } = req.params;
    const {description} = req.body;

    try {
        const portofolio = await Portofolio.update({
            portofolio_description: description
        }, {
            where: {id_portofolio: idPortofolio},
            returning: true
        });

        res.status(200).json({portofolio});
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};
import { response } from "express";
import { deleteImage, uploadImages } from "../utils/cloudinary.js";
import { Portofolio } from "../models/Portofolio.js";

export const uploadPortofolio = async (req, res = response) => {
    let images = req.files['images[]'];
    const {portofolioDescription, count} = req.body;
    
    if(count == 1) {
        images = [images];
    }

    const { idProvider } = req.params;

    try {
        const response = await uploadImages(idProvider, images, portofolioDescription);


        const portofolio = await Portofolio.bulkCreate(response);

        res.status(200).json({
            msg: 'images uploaded',
            portofolio
        })
    } catch (error) {
        res.status(401).json({msg: error.message})
    }

}

export const getPortofolio = async (req, res = response) => {
    const { idProvider } = req.params;
    
    try {
        const portofolio = await Portofolio.findAll({
            where: {providerId: idProvider},
            order: [['id_portofolio', 'ASC']]
        });

        res.status(200).json({portofolio});
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const getOnePortofolio = async (req, res = response) => {
    const {idPortofolio} = req.params;

    try {
        const portofolio = await Portofolio.findOne({
            where: {id_portofolio: idPortofolio}
        });

        res.status(200).json({portofolio})
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

export const deleteImagePortofolio = async (req, res = response) => {
    const { idPortofolio } = req.params;
    const { portofolioImage } = req.body;

    try {

        const imgDelete = deleteImage(portofolioImage);
        if(imgDelete) {
            await Portofolio.destroy({
                where: {id_portofolio: idPortofolio}
            });
        }


        res.status(200).json({msg: 'Image successfully removed'});
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
}
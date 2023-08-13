import { response } from "express";
import { uploadGallery } from "../utils/cloudinary.js";
import { Gallery } from "../models/Gallery.js";

export const uploadGalleryImages = async (req, res = response) => {
    let images = req.files['images[]'];
    const {count} = req.body;
    
    if(count == 1) {
        images = [images];
    }

    const { idContract } = req.params;

    try {
        const response = await uploadGallery(idContract, images);


        const gallery = await Gallery.bulkCreate(response);

        res.status(200).json({
            msg: 'images uploaded',
            gallery
        })
    } catch (error) {
        res.status(401).json({msg: error.message})
    }

}

export const getGallery = async (req, res = response) => {
    const { idContract } = req.params;
    
    try {
        const gallery = await Gallery.findAll({
            where: {contractId: idContract},
            order: [['id_gallery', 'ASC']]
        });

        res.status(200).json({gallery});
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const getOneGallery = async (req, res = response) => {
    const {idGallery} = req.params;

    try {
        const gallery = await Gallery.findOne({
            where: {id_gallery: idGallery}
        });

        res.status(200).json({gallery})
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};
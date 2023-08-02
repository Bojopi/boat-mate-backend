import { response } from "express";
import { License } from "../models/Licenses.js";
import { sequelize } from "../database/database.js";
import { uploadFile } from "../utils/s3.js";
import { deleteLicense, uploadImageLicense } from "../utils/cloudinary.js";
import fs from 'fs';
import path from "path";

export const uploadLicense = async (req, res = response) => {
    const {idProvider} = req.params;

    const license = req.files['license[]'];

    let dataUpdate = { providerId: idProvider };
    const arrayData = [];
    
    try {
        let licenseData;
        await sequelize.transaction(async (t) => {
            const licenses = await License.findAll({
                where: {providerId: idProvider},
                transaction: t
            });
            if(licenses.length > 0) {
                for(const item of licenses) {
                    // delete old file in cloudinary
                    if(!item.license_name.includes('.pdf')) {
                        const resDelete = await deleteLicense(item.license_name);
                        console.log('imagen', resDelete)
                    }
                }
                await License.destroy({where:{providerId : idProvider}},{transaction:t});
            }

            //upload licenses
            if(license.length > 0) {
                for(const item of license) {
                    dataUpdate = {...dataUpdate, providerId: idProvider}
                    if(item.mimetype.includes('image')) {
                        const result = await uploadImageLicense(item.tempFilePath);
                        dataUpdate.license_url = result.secure_url;
                        dataUpdate.license_name = (result.public_id).split('/')[1];
                    } else {
                        const result = await uploadFile(item);
                        dataUpdate.license_url = result.Location;
                        dataUpdate.license_name = result.Key;
                    }
                    
                    fs.unlinkSync(path.join(item.tempFilePath));
                    
                    arrayData.push(dataUpdate);
                };
                licenseData = await License.bulkCreate(arrayData, {
                    transaction: t
                });
            } else {
                if(license.mimetype.includes('image')) {
                    const result = await uploadImageLicense(license.tempFilePath);
                    dataUpdate.license_url = result.secure_url;
                    dataUpdate.license_name = (result.public_id).split('/')[1];
                } else {
                    const result = await uploadFile(license);
                    dataUpdate.license_url = result.Location;
                    dataUpdate.license_name = result.Key;
                }

                fs.unlinkSync(path.join(license.tempFilePath));

                licenseData = await License.create(dataUpdate, {
                    transaction: t
                });
            }
            res.status(200).json({
                msg: 'License successfully updated',
                license: licenseData
            })
        })
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const getLicenses = async (req, res = response) => {
    const { idProvider } = req.params;
    
    try {
        const licenses = await License.findAll({
            where: {providerId: idProvider}
        });

        res.status(200).json({licenses});
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

// export const getOnePortofolio = async (req, res = response) => {
//     const {idPortofolio} = req.params;

//     try {
//         const portofolio = await Portofolio.findOne({
//             where: {id_portofolio: idPortofolio}
//         });

//         res.status(200).json({portofolio})
//     } catch (error) {
//         return res.status(400).json({msg: error.message});
//     }
// };

// export const updatePortofolio = async (req, res = response) => {
//     const { idPortofolio } = req.params;
//     const {description} = req.body;

//     try {
//         const portofolio = await Portofolio.update({
//             portofolio_description: description
//         }, {
//             where: {id_portofolio: idPortofolio},
//             returning: true
//         });

//         res.status(200).json({portofolio});
//     } catch (error) {
//         return res.status(400).json({msg: error.message});
//     }
// };

// export const deleteImagePortofolio = async (req, res = response) => {
//     const { idPortofolio } = req.params;
//     const { portofolioImage } = req.body;

//     try {

//         const imgDelete = deleteImage(portofolioImage);
//         if(imgDelete) {
//             await Portofolio.destroy({
//                 where: {id_portofolio: idPortofolio}
//             });
//         }


//         res.status(200).json({msg: 'Image successfully removed'});
//     } catch (error) {
//         return res.status(400).json({msg: error.message});
//     }
// }
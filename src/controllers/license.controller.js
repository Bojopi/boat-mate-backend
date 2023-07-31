import { response } from "express";
import { License } from "../models/Licenses.js";
import { sequelize } from "../database/database.js";
import { uploadFile } from "../utils/s3.js";
import { uploadImageLicense } from "../utils/cloudinary.js";
import fs from 'fs';
import path from "path";

export const uploadLicense = async (req, res = response) => {
    const {idProvider} = req.params;

    const {license} = req.files;

    let dataUpdate = { providerId: idProvider };

    
    try {
        let licenseData;
        const arrayData = [];
        await sequelize.transaction(async (t) => {
            const licenses = await License.findAll({
                where: {providerId: idProvider},
                transaction: t
            });

            console.log(licenses)
            if(licenses.length > 0) {
                console.log('hay archivos')
            } else {
                console.log('no hay archivos')
                if(license.length > 0) {
                    for(const item of license) {
                        console.log(item)
                        if(item.mimetype.includes('image')) {
                            console.log('es una imagen');
                            const result = await uploadImageLicense(item.tempFilePath);
                            dataUpdate.license_url = result.secure_url;
                            dataUpdate.license_name = result.original_filename;
                        } else {
                            console.log('es un pdf');
                            const result = await uploadFile(item);
                            dataUpdate.license_url = result.Location;
                            dataUpdate.license_name = result.Key;
                        }
                        
                        fs.unlinkSync(path.join(item.tempFilePath));
                        
                        arrayData.push(dataUpdate);

                    };

                    console.log(arrayData)
                    licenseData = await License.bulkCreate(arrayData, {
                        transaction: t
                    });
                } else {
                    if(license.mimetype.includes('image')) {
                        const result = await uploadImageLicense(license.tempFilePath);
                        dataUpdate.license_url = result.secure_url;
                        dataUpdate.license_name = result.original_filename
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
            }
            res.status(200).json({
                msg: 'License successfully updated',
                license: licenseData
            })
            // if(license != null && license != undefined && provider_license != null && provider_license != '') {
            //     const resDelete = await deleteFile(provider_license);
            //     if(resDelete) {
            //         const result = await uploadFile(license.tempFilePath);
            //         dataUpdate.provider_license = result.secure_url;
            //         fs.unlinkSync(path.join(license.tempFilePath));
            //     }
            // } else if(license != null && license != undefined) {
            //     const result = await uploadFile(license.tempFilePath);
            //     dataUpdate.provider_license = result.secure_url;
            //     fs.unlinkSync(path.join(license.tempFilePath));
            // }

            // await Provider.update(dataUpdate, {
            //     where: {id_provider: idProvider},
            //     transaction: t
            // });
        })
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

// export const getPortofolio = async (req, res = response) => {
//     const { idProvider } = req.params;
    
//     try {
//         const portofolio = await Portofolio.findAll({
//             where: {providerId: idProvider},
//             order: [['id_portofolio', 'ASC']]
//         });

//         res.status(200).json({portofolio});
//     } catch (error) {
//         return res.status(400).json({msg: error.message});
//     }
// };

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
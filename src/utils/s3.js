import AWS from 'aws-sdk';
import fs from 'fs';

AWS.config.update({
    region: 'us-east-1',
    credentials: {
        accessKeyId: 'AKIAT5YN6ZSDPA2ISI6N',
        secretAccessKey: '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'
    }
});

const s3 = new AWS.S3();
const BUCKET = 'boatmate-bucket'

export const uploadFile = async (file) => {

    const param = {
        Bucket: BUCKET,
        Key: `${file.name}`,
        Body: fs.createReadStream(file.tempFilePath)
    };
    return await s3.upload(param).promise();
}

// export const uploadFile = async (filePath) => {
//     return await cloudinary.uploader.upload(filePath, {
//         folder: 'licenses'
//     });
// }

// export const uploadImageService = async (imgPath) => {
//     return await cloudinary.uploader.upload(imgPath, {
//         folder: 'services'
//     });
// }

// export const uploadImages = async (idProvider, files, description) => {
//     const urls = [];
//     for(const file of files) {
//         await cloudinary.uploader.upload(file.tempFilePath, {
//             folder: `portofolio/provider/${idProvider}`
//         }, (err, res) => {
//             if(err) {
//                 console.log(err);
//                 return err
//             }

//             urls.push({
//                 portofolio_image: res.secure_url,
//                 providerId: idProvider,
//                 portofolio_description: description
//             });
//         })
//     }

//     if(urls.length === files.length) return urls
// }

// export const deleteImage = async (secureUrl) => {
//     let fileName = String(secureUrl).split('/')
//     fileName = fileName[fileName.length - 1].split('.')[0]
//     return await cloudinary.uploader.destroy(`boatmate/${fileName}`)
// }

// export const deleteFile = async (secureUrl) => {
//     let fileName = String(secureUrl).split('/')
//     fileName = fileName[fileName.length - 1].split('.')[0]
//     return await cloudinary.uploader.destroy(`licenses/${fileName}`)
// }

// export const searchImage = async (secureUrl) => {
//     let fileName = String(secureUrl).split('/')
//     fileName = fileName[fileName.length - 1].split('.')[0]
//     try {
//         const result = await cloudinary.search
//         .expression(`${fileName}`)
//         .execute();

//         if(result.total_count === 0) {
//             return false;
//         } else {
//             return true;
//         }
//     } catch (error) {
//         console.error(error);
//         return false;
//     }
// }

// export const searchFile = async (secureUrl) => {
//     let fileName = String(secureUrl).split('/')
//     fileName = fileName[fileName.length - 1].split('.')[0]
//     try {
//         const result = await cloudinary.search
//         .expression(`${fileName}`)
//         .execute();

//         if(result.total_count === 0) {
//             return false;
//         } else {
//             return true;
//         }
//     } catch (error) {
//         console.error(error);
//         return false;
//     }
// }
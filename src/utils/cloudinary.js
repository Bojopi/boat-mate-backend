import {v2 as cloudinary} from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { unlink } from 'node:fs'

// Configuration 
cloudinary.config({
    cloud_name: "dqwsuo4cr",
    api_key: "458582129737792",
    api_secret: "0aQwjQNEHp8cOKbVw_upmWHQwWo"
  });

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'portofolio',
        resource_type: 'image'
    }
});

const upload = multer({storage: storage});

export const uploadImage = async (imgPath) => {
    return await cloudinary.uploader.upload(imgPath, {
        folder: 'boatmate'
    });
}

export const uploadImages = async (idProvider, files) => {
    const urls = [];
    for(const file of files) {
        await cloudinary.uploader.upload(file.tempFilePath, {
            folder: `portofolio/provider/${idProvider}`
        }, (err, res) => {
            if(err) {
                console.log(err);
                return err
            }

            urls.push(res.secure_url);
        })
    }

    if(urls.length === files.length) return urls
}

export const searchImage = async (secureUrl) => {
    try {
        const result = await cloudinary.search
        .expression(`secure_url:${secureUrl}`)
        .execute();

        if(result.total_count === 0) {
            return false;
        } else {
            return true;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
}
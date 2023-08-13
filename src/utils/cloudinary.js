import {v2 as cloudinary} from 'cloudinary';

// Configuration 
cloudinary.config({
    cloud_name: "dqwsuo4cr",
    api_key: "458582129737792",
    api_secret: "0aQwjQNEHp8cOKbVw_upmWHQwWo"
  });

export const uploadImage = async (imgPath) => {
    return await cloudinary.uploader.upload(imgPath, {
        folder: 'boatmate'
    });
}

export const uploadImageLicense = async (imgPath) => {
    return await cloudinary.uploader.upload(imgPath, {
        folder: 'licenses'
    });
}

export const uploadImageService = async (imgPath) => {
    return await cloudinary.uploader.upload(imgPath, {
        folder: 'services'
    });
}

export const uploadImages = async (idProvider, files, description) => {
    const urls = [];
    for(const file of files) {
        await cloudinary.uploader.upload(file.tempFilePath, {
            folder: `portofolio/provider/${idProvider}`
        }, (err, res) => {
            if(err) {
                console.log(err);
                return err
            }

            urls.push({
                portofolio_image: res.secure_url,
                providerId: idProvider,
                portofolio_description: description
            });
        })
    }

    if(urls.length === files.length) return urls
}

export const uploadGallery = async (idContract, files) => {
    const urls = [];
    for(const file of files) {
        await cloudinary.uploader.upload(file.tempFilePath, {
            folder: `gallery/contract/${idContract}`
        }, (err, res) => {
            if(err) {
                console.log(err);
                return err
            }

            urls.push({
                gallery_image: res.secure_url,
                contractId: idContract
            });
        })
    }

    if(urls.length === files.length) return urls
}

export const deleteImage = async (secureUrl) => {
    let fileName = String(secureUrl).split('/')
    fileName = fileName[fileName.length - 1].split('.')[0]
    return await cloudinary.uploader.destroy(`boatmate/${fileName}`)
}

export const deleteLicense = async (fileName) => {
    return await cloudinary.uploader.destroy(`licenses/${fileName}`)
}

export const searchImage = async (secureUrl) => {
    let fileName = String(secureUrl).split('/')
    fileName = fileName[fileName.length - 1].split('.')[0]
    try {
        const result = await cloudinary.search
        .expression(`${fileName}`)
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

export const searchFile = async (secureUrl) => {
    let fileName = String(secureUrl).split('/')
    fileName = fileName[fileName.length - 1].split('.')[0]
    try {
        const result = await cloudinary.search
        .expression(`${fileName}`)
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
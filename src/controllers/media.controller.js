import { response } from "express"
import { uploadImage } from "../utils/cloudinary.js";

export const UploadImage = async (req, res= response) => {
    
    console.log(req.files);    

    const result = await uploadImage(req.files?.image.tempFilePath);
    console.log(result)

    res.send('upload archive');
}


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

export const deleteFile = async (name) => {
    const param = {
        Bucket: BUCKET,
        Key: `${name}`
    };

    try {
        return await s3.deleteObject(param).promise();
    } catch (error) {
        console.log(error)
    }

}
import AWS from 'aws-sdk';
const fs = require("fs");

export const uploadImage = async (req) => {
    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    })
    const imagePath = req.path
    const blob = fs.readFileSync(imagePath)

    const uploadedImage = await s3.upload({
      Bucket: process.env.AWS_BUCKET,
      Key: req.originalname,
      Body: blob,
    }).promise();
    console.log('location---', uploadedImage);

    return uploadedImage.Location;
};
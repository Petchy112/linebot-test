const express = require('express');
const router = express.Router();
const withAuth = require('../middleware/withAuth');
const imageService = require('../../../services/image');
const createError = require('http-errors');
const path = require('path');
const upload = require('../../../multer/storage');
const  cloudinary  = require('cloudinary').v2;
const User = require('../../../models/User');

cloudinary.config({
    cloud_name: 'hf3sdjrow', 
    api_key: '755298651479236', 
    api_secret: 'D2Te4z6hhd1hqyJP3-4GVVLKWXE',
  });


router.post('/upload', withAuth, upload.single('images'), async (req, res, next) => {
    try {
        const image = req['file']
        console.log(image);        
        const result = await cloudinary.uploader.upload(image.path ,{
            upload_preset: 'estimatedTime',
            public_id: `${image.originalname}`
        }) 
        res.json({path : result.secure_url}) 
    }
    catch (error) {
        next(error)
        throw error
    }
})

router.post('/uploadProfile', withAuth, upload.single('images'), async (req, res, next) => {
    try {
        const image = req['file']
        console.log(image);        
        const result = await cloudinary.uploader.upload(image.path ,{
            upload_preset: 'estimatedTime',
            public_id: `${req.userId}`
        }) 

        const userData = await User.findById(userId)
        userData.profilePic = result.secure_url
        await userData.save()

        res.json({message:'Upload successfully!', path : result.secure_url}) 
    }
    catch (error) {
        next(error)
        throw error
    }
})

module.exports =  router
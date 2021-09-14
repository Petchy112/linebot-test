const express = require('express');
const router = express.Router();
const withAuth = require('../middleware/withAuth');
const imageService = require('../../../services/image');
const createError = require('http-errors');
const path = require('path');
const upload = require('../../../multer/storage');

router.post('/uploadUserImage', withAuth, upload.single('images'), async (req, res, next) => {
    try {
        const image = req['file']
        const accessToken = req.accessToken
        const upload = await imageService.uploadUserImage(accessToken, image)
        res.json(upload)
    }
    catch (error) {
        next(error)
        throw error
    }
})
router.post('/uploadChoiceImage', withAuth, upload.single('images'), async (req, res, next) => {
    try {
        const image = req['file']
        const accessToken = req.accessToken
        const upload = await imageService.uploadChoiceImage(accessToken, image)
        console.log(upload.id)
        const imageData = await imageService.getChoiceImage(upload.id)
        if (imageData.data) {
            const image = {
                id: imageData.data.id,
                fullPath: 'http' + '://' + req.get('host') + '/image/getImage/' + imageData.data.name,
            }
            
            res.json(image)
        }
        else {
            res.json({})
        }
    }
    catch (error) {
        next(error)
        throw error
    }
})
router.get('/getImage', async (req, res, next) => {
    try {
        const { query } = req
        console.log(query.userId)

        if (!query.userId) {
            return
        }
        
        const imageData = await imageService.getImage(query.userId)
        console.log(imageData);
        if (imageData.data) {
            const image = {
                id: imageData.data.id,
                fullPath: 'http' + '://' + req.get('host') + '/image/getImage/' + imageData.data.name,
            }

            res.json(image)
        }
        else {
            res.json({})
        }
    }
    catch (error) {
        next(error)

    }
})
router.get('/getImage/:name', async(req, res, next) => {

    const name = req.params.name
    console.log(name)
    if(name == null){
        return
    }

    const options = {
        root: path.join(__dirname, '../../../../uploads'),
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true,
            'Content-Type': 'image/png',
        },
    }
    res.sendFile(name, options, function (err) {
        if (err) {
            next(err)
        }
        else {
            console.log('Sent:', name)
        }
    })
})
module.exports =  router
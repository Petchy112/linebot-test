const express = require('express');
const router = express.Router();
const withAuth = require('../middleware/withAuth');
const imageService = require('../../../services/image');
const createError = require('http-errors');
const path = require('path');
const upload = require('../../../multer/storage');


router.post('/uploadImage', withAuth, upload.single('images'), async (req, res, next) => {
    try {
        console.log(req);
        const image = req['file']
        const accessToken = req.accessToken
        const upload = await imageService.uploadImage(accessToken, image)
        res.json(upload)
    }
    catch (error) {
        next(error)
    }
})

router.get('/getImage/:name', async(req, res, next) => {
    console.log('yes')

    const name = request.params.name
    console.log(name)

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

router.get('/getImage', async (req, res,next) => {
    try {
        
        const { query } = req
        console.log(query.imageId)

        if (!query.imageId) {
            throw createError(404, 'The imageId was empty')
        }

        const imageData = await imageService.getImage(query.imageId)
        if (imageData) {
            const image = {
                id: imageData.data.id,
                fullPath: 'http' + '://' + request.get('host') + '/api/getImage/' + imageData.data.name,
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

module.exports =  router
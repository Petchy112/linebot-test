const UserAuth = require('../models/UserAuth');
const Image = require('../models/Image');
const Function = require('../models/Function')

const imageService = {
    async uploadChoiceImage(accessToken, imageData) {
        console.log('upload choice image called', accessToken)
        console.log('imageData',imageData);
        
        const userTokenData = await UserAuth.findOne({ accessToken })
        console.log('userTokenData ',userTokenData);
            const image = new Image()
            image.refId = userTokenData.userId,
            image.name = imageData.filename,
            image.imagePath = imageData.path,
            image.mimetype = imageData.mimetype
                await image.save()
        
        return { message: 'upload successful', id:image._id}
    },
    async uploadUserImage(accessToken, imageData) {
        console.log('upload image called', accessToken)
        
        const userTokenData = await UserAuth.findOne({ accessToken })
        console.log(userTokenData);
        
        const haveImage = await Image.findOne({ refId : userTokenData.userId })
        console.log(haveImage);
        if(haveImage) {
            haveImage.refId = userTokenData.userId,
            haveImage.name = imageData.filename,
            haveImage.imagePath = imageData.path,
            haveImage.mimetype = imageData.mimetype
                await haveImage.save()  
        }
        else {
            const image = new Image()
            image.refId = userTokenData.userId,
            image.name = imageData.filename,
            image.imagePath = imageData.path,
            image.mimetype = imageData.mimetype
                await image.save()
        }
        
        return { message: 'upload successful' }
    },
    async getImage(uid) {
        const image = await Image.findOne({ refId: uid })
        return { successful: true, data: image }
    },
    async getChoiceImage(uid) {
        const image = await Image.findById(uid)
        return { successful: true, data: image }
    },
}

module.exports = imageService
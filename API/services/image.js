const UserAuth = require('../models/userAuthModel');
const Image = require('../models/Image');

const imageService = {
    async uploadImage(accessToken, imageData) {
        console.log('upload image called', accessToken)
        
        const userTokenData = await UserAuth.findOne({ accessToken })
        console.log(userTokenData);
        
        const image = new Image()
            image.refId = userTokenData.userId,
            image.name = imageData.filename,
            image.imagePath = imageData.path,
            image.mimetype = imageData.mimetype
        await image.save()
        return { message: 'upload successful', data: image }
    },
    async getImage(id) {
        const image = await Image.findOne({ _id: id })
        return { successful: true, data: image }
    },
}

module.exports = imageService
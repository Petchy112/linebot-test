const User = require('../../../models/userModel');
const UserAuthToken = require('../../../models/userAuthModel');
const ExpressRequest = require('express');

class checkAuth extends ExpressRequest {
    constructor() {
        accessToken = String,
            accessTokenExpiresAt = Date,
            userId = String
    }
}
module.exports = async (req = checkAuth, res, next) => {
    try {
        if (req.headers.authorization) {
            console.log(req.headers.authorization, 'authen');
            const token = req.headers.authorization.replace('Bearer ', '')
            const userTokenData = await UserAuthToken.findOne({ accessToken: token })
            if (userTokenData) {
                const userData = await User.findOne({ _id: userTokenData.userId })
                if (userData && userTokenData.accessTokenExpiresAt && userTokenData.accessTokenExpiresAt > new Date()) {
                    ExpressRequest.accessToken = userTokenData.accessToken
                    ExpressRequest.accessTokenExpiresAt = userTokenData.accessTokenExpiresAt
                    ExpressRequest.userId = userData.id
                    next()
                }
                else {
                    ExpressRequest.userId = null
                    next()
                }
            }
        }
        else {
            ExpressRequest.userId = null
            next()
        }
    }
    catch (error) {
        ExpressRequest.userId = null
        next()
    }
}
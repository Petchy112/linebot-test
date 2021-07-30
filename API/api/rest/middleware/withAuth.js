const User = require('../../../models/userModel');
const UserAuthToken = require('../../../models/userAuthModel');
const ExpressRequest = require('express');
const createError = require('http-errors');

class checkAuth extends ExpressRequest {
    constructor() {
        accessToken = String
        accessTokenExpiresAt = Date
        userId = String
    }
}
module.exports = async (req = checkAuth, res, next) => {
    try {
        if (req.headers.authorization) {
            console.log(req.headers.authorization, 'in middleware ^^');
            const token = req.headers.authorization.replace('Bearer ', '')
            const userTokenData = await UserAuthToken.findOne({ accessToken: token })
            if (userTokenData) {
                const userData = await User.findOne({ _id: userTokenData.userId })
                if (userData && userTokenData.accessTokenExpiresAt && userTokenData.accessTokenExpiresAt > new Date()) {
                    req.accessToken = userTokenData.accessToken
                    req.accessTokenExpiresAt = userTokenData.accessTokenExpiresAt
                    req.userId = userData.id
                    next()
                }
                else {
                    req.userId = null
                    next(createError(401, 'Please sign into website'))
                    throw err
                }
            }
        }
        else {
            req.userId = null
            next(createError(401, 'No access token'))
        }
    }
    catch (error) {
        req.userId = null
        next()
    }
}
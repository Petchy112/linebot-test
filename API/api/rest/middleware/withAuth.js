const User = require('../../../models/userModel');
const UserAuth = require('../../../models/userAuthModel');
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
            const userTokenData = await UserAuth.findOne({ accessToken : token })
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
                    next(createError(401,'Please Sign into website'))
                    console.log('error')
                }
            }
            else {
                req.userId = null
                next(createError(401,'Please Sign into website'))
            }
        }
        else {
            req.userId = null
            next()
        }
    }
    catch (error) {
        req.userId = null
        next()
    }
}
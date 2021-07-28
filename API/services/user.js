const User = require('../models/userModel');
const UserAuthToken = require('../models/userAuthModel');
const generatePasswordHash = require('../helper/passwordHash');
const createError = require('http-errors');
const config = require('../config');
const jwt = require('jsonwebtoken');
const { ConnectionStates } = require('mongoose');


const userService = {
    async register(input) {
        console.log('register called', input);

        const userdata = new User();
        userdata.email = input.email,
            userdata.password = input.password,
            userdata.firstname = input.firstname,
            userdata.lastname = input.lastname

        var isExistEmail = await User.findOne({ email: input.email })
        if (isExistEmail) {
            return createError(400, 'Email is already use')

        }
        await userdata.save();
        userdata.userId = userdata._id
        await userdata.save();

        if (userdata) {
            return { message: 'Register successful' }
        }
    },
    async login(email, password) {
        const thisUser = await User.findOne({ email });

        if (thisUser) {
            if (thisUser.password !== password) {
                throw createError(400, 'Password was invalid');
            }

            const accessTokenExpiresAt = new Date()
            console.log(accessTokenExpiresAt);
            const signOptionAccessToken = {
                ...config.session.JWT,
                expiresIn: config.auth.expireIn.accessToken
            }
            const payloadAccessToken = {
                firstname: thisUser.firstname,
                lastname: thisUser.lastname,
            }
            const expiresIn = config.auth.expireIn.accessToken;
            accessTokenExpiresAt.setSeconds(accessTokenExpiresAt.getSeconds() + expiresIn)
            console.log(accessTokenExpiresAt);

            const accessToken = jwt.sign(payloadAccessToken, 'secret', signOptionAccessToken)

            const UserAuth = new UserAuthToken()
            UserAuth.userId = thisUser.userId,
                UserAuth.accessToken = accessToken,
                UserAuth.accessTokenExpiresAt = accessTokenExpiresAt
            UserAuth.save();
            return { message: 'Login successful', accessToken: accessToken }
        }
        else {
            throw createError(400, 'Email was invalid ,Please try again');
        }
    },
}

module.exports = userService
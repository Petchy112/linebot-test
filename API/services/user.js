const User = require('../models/userModel');
const UserAuth = require('../models/userAuthModel');
const createError = require('http-errors');
const config = require('../config');
const jwt = require('jsonwebtoken');
const argon2 = require('@phc/argon2');

const userService = {
    async register(input) {
        console.log('register called', input);

        const userdata = new User();
        userdata.email = input.email,
            userdata.passwordHash = await argon2.hash(input.password),
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
            var checkPassword = await argon2.verify(thisUser.passwordHash, password)
            if (!checkPassword) {
                throw createError(400, 'Password was invalid');
            }

            const accessTokenExpiresAt = new Date()
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

            const accessToken = jwt.sign(payloadAccessToken, 'secret', signOptionAccessToken)
            const userdata = new UserAuth()
            userdata.userId = thisUser.userId,
                userdata.accessToken = accessToken,
                userdata.accessTokenExpiresAt = accessTokenExpiresAt
            userdata.save();
            return { message: 'Login successful', accessToken: accessToken }
        }
        else {
            throw createError(400, 'Email was invalid ,Please try again');
        }
    },
    // async revokeAccessToken(accessToken) {
    //     await UserAuthToken.findOneAndDelete({ accessToken });
    //     return { message: 'Logout successful' }
    // },
    // async getProfile(accessToken) {
    //     var userTokenData = await UserAuth.findOne({ accessToken })
    //     var userInfo = await User.findOne({ userId: userTokenData.userId })
    //     var result = {
    //         firstname: userInfo.firstname,
    //         lastname: userInfo.lastname,
    //         email: userInfo.email
    //     }
    //     return result
    // },
    // async changePassword(email, oldPassword, newPassword) {
    //     var thisUser = await User.findOne({ email })

    //     if (thisUser) {
    //         console.log(thisUser.passwordHash)
    //         var ExistPassword = await argon2.verify(thisUser.passwordHash, oldPassword)
    //         if (ExistPassword) {
    //             throw createError(400, 'Please change password.')
    //         }
    //         else {
    //             thisUser.passwordHash = await argon2.hash(newPassword)
    //             thisUser.save()
    //         }
    //         return { message: 'change password successful' }
    //     }
    // },
}

module.exports = userService
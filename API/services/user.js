const User = require('../models/User');
const UserAuth = require('../models/UserAuth');
const createError = require('http-errors');
const config = require('../config');
const jwt = require('jsonwebtoken');
const argon2 = require('@phc/argon2');

const userService = {
    async register(input) {
        console.log('register called', input);

        const userdata = new User();
        userdata.email = input.email
        userdata.passwordHash = await argon2.hash(input.password)
        userdata.firstname = input.firstname
        userdata.lastname = input.lastname
        userdata.role = input.role
        

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
    async login(email, password, lineUserId, profilePic) {
        console.log('login call',email)
        const thisUser = await User.findOne({ email });
        if (thisUser) {
            if (lineUserId) {
                if (!thisUser.lineUserId) {
                    thisUser.lineUserId = lineUserId
                    thisUser.profile = profilePic
                    await thisUser.save()
                }
            }
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
                return { message: 'Login successful', accessToken: accessToken, role: thisUser.role, lineUserId: thisUser.lineUserId }
        }
        else {
            throw createError(400, 'Email was invalid ,Please try again');
        }
    },
    async revokeAccessToken(accessToken) {
        await UserAuth.findOneAndDelete({ accessToken });
        return { message: 'Logout successful' }
    },
    async getProfile(userId) {
        try {
            const userTokenData = await UserAuth.findOne({ userId })
            const userInfo = await User.findOne({ userId: userTokenData.userId })
            const result = {
                id: userInfo._id,
                firstname: userInfo.firstname,
                lastname: userInfo.lastname,
                email: userInfo.email,
                role: userInfo.role,
                profilePic : userInfo.profilePic
            }
            return result
        }
        catch (error) {
            next(error)
            throw error
        }
    },
    async changePassword(input, userId) {
        const {
            oldPassword,
            newPassword
        } = input 
        
        const thisUser = await User.findOne({ userId })
        if (!await argon2.verify(thisUser.passwordHash, oldPassword)) {
            throw createError(400, 'Old password was invalid')
        }
        if (thisUser) {
            if (await argon2.verify(thisUser.passwordHash, newPassword)) {
                throw createError(400, 'Please change password.')
            }
            else {
                thisUser.passwordHash = await argon2.hash(newPassword)
                thisUser.save()
                return { successful: true, message: 'change password successful.' }
            }
        }
    },
}

module.exports = userService
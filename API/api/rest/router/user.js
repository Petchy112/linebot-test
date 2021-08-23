const express = require('express');
const userService = require('../../../services/user');
const router = express.Router();
const validate = require('validator');
const createError = require('http-errors');
const withAuth = require('../middleware/withAuth');
const { checkAuth } = require('../middleware/withAuth');
const User = require('../../../models/userModel');

router.post('/login', async (req, res, next) => {
    try {
        var { body } = req
        if (!body.email) {
            next(createError(400, 'Email was empty'))
            return
        }
        if (!body.password) {
            next(createError(400, 'Password was empty'))
            return
        }
        const result = await userService.login(body.email, body.password)
        await res.json(result)
    }
    catch (error) {
        next(error)

    }
})
router.post('/register', withAuth, async (req, res, next) => {
    try{
        var { body } = req
        if (!body.email) {
            next(createError(400, 'Email was empty'))
            return
        }
        if (body.email && !validate.isEmail(body.email)) {
            next(createError(400, 'Email was invalid'))
            return
        }
        if (!body.password) {
            next(createError(400, 'Password was empty'))
            return
        }
        if (!body.confirmPassword) {
            next(createError(400, 'Confirm Password was empty'))
            return
        }
        if (body.confirmPassword !== body.password) {
            next(createError(400, 'Password is not match'))
            return
        }
        if (!body.firstname) {
            next(createError(400, 'Firstname was empty'))
            return
        }
        if (!body.lastname) {
            next(createError(400, 'Lastname was empty'))
            return
        }
        const result = await userService.register(req.body);
        res.json(result);
    }
    catch (error) {
        next(error)
        throw error
    }

})
router.post('/logout', withAuth, async (req, res, next) => {
    try {
        const result = await userService.revokeAccessToken(req.accessToken)
        res.json(result);
    }
    catch {
        next(error)
        throw error
    }
})
router.get('/data', withAuth, async (req, res, next) => {
    try {
        const result = await userService.getProfile(req.headers.authorization.replace('Bearer ', ''))
        res.json(result);
    }
    catch {
        next(error);
    }
})
router.post('/changePassword', withAuth, async (req, res, next) => {
    try {
        var { oldPassword, newPassword, confirmPassword } = req.body
        if (!oldPassword) {
            next(createError(400, 'old password was empty'))
            return
        }
        if (!newPassword) {
            next(createError(400, 'new password was empty'))
            return
        }
        if (!confirmPassword) {
            next(createError(400, 'comfirm password was empty'))
            return
        }
        if (confirmPassword !== newPassword) {
            next(createError(400, 'password is not match'))
            return
        }
        const result = await userService.changePassword(oldPassword, newPassword, req.userId)
        res.json(result)
    }
    catch (error) {
        next(error)
    }
})
router.get('/', withAuth, async (req, res, next) => {
    try {
        const result = await User.find().exec()
        await res.json(result);
    }
    catch(error) {
        next(error);
        throw error
    }
})
router.get('/:id', withAuth, async (req, res, next) => {
    try {
        console.log(req.params.id)
        var uid = req.params.id
        await User.findById((uid), (err, result) => {
            if (err) next(error)
            res.json(result);
        })
    }
    catch {
        next(error)
        throw error
    }
})
router.delete('/:id', withAuth, async (req, res, next) => {
    try {
        console.log(req.params.id);
        await User.findByIdAndDelete((req.params.id), (err, result) => {
            if (err) next(error)
            result = { message: 'User is deleted' }
            res.json(result);
        })
    }
    catch {
        next(error)
        throw error

    }
})
module.exports = router
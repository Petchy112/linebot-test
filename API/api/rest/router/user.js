const express = require('express');
const userService = require('../../../services/user');
const router = express.Router();
const validate = require('validator');
const createError = require('http-errors');

router.post('/register', async (req, res, next) => {

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
        next(createError(400, 'fff'))
        return
    }
    if (!body.lastname) {
        next(createError(400, 'Lastname was empty'))
        return
    }
    const result = await userService.register(req.body);
    res.json(result);


})
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
module.exports = router
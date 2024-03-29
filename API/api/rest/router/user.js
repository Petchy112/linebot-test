const express = require('express');
const userService = require('../../../services/user');
const router = express.Router();
const validate = require('validator');
const createError = require('http-errors');
const withAuth = require('../middleware/withAuth');
const User = require('../../../models/User');
const line = require('@line/bot-sdk');
const configLine = require('../../../config')
const client = new line.Client(configLine.line);

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
        const result = await userService.login(body.email, body.password, body.lineUserId, body.profilePic)
        await res.json(result)
    }
    catch (error) {
        next(error)
        throw error
    }
})
router.post('/selectRole', withAuth, async (req, res, next) => {
    try {
        let role = req.body.role
            if(role == 'ADMIN'){
                next(createError(403 , 'ADMIN NOT PERMISSION IN LINE'))
            }
            if(role == 'VOTER'){
                var userId = req.body.lineUserId
                client.linkRichMenuToUser(userId, "richmenu-4d1399069af0e409fc0c3dfaaec678d4");
            }
            else if(role == 'COORDINATOR') {
                var userId = req.body.lineUserId
                client.linkRichMenuToUser(userId, "richmenu-d0a658e03d87c2d0dfaa8b770ecdf093");
            }
        var result = {message: 'selected role '}
        res.json(result)
    }
    catch (error) {
        next(error)
        throw error
    }
})
router.post('/add', withAuth, async (req, res, next) => {
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
        if (!body.role) {
            next(createError(400, 'Role was empty'))
            return
        }
        if (!body.position) {
            next(createError(400, 'Position was empty'))
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
        if(req.body['lineUserId']) {
            client.unlinkRichMenuFromUser(req.body['lineUserId']);
        }
        res.json(result);
    }
    catch (error) {
        next(error)
        throw error
    }
})
router.get('/getProfile', withAuth, async (req, res, next) => {
    try {
        const result = await userService.getProfile(req.userId)
        res.json({successful:true, profile:result});
    }
    catch {
        next(error);
    }
})
router.post('/changePassword', withAuth, async (req, res, next) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body
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
        const result = await userService.changePassword(req.body, req.userId)
        res.json(result)
    }
    catch (error) {
        next(error)
    }
})
router.get('/list', withAuth, async (req, res, next) => {
    try {
        const result = await User.find().exec()
        await res.json({successful: true , userLists: result});
    }
    catch(error) {
        next(error);
        throw error
    }
})
router.get('/:id', withAuth, async (req, res, next) => {
    try {
        let uid = req.params.id
        const data = await User.findById(uid)
        let user = {
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            role: data.role,
            position: data.position
        }
        res.json({
            successful: true,
            user
        });
    }
    catch (error) {
        next(error)
        throw error
    }
})
router.delete('/:id', withAuth, async (req, res, next) => {
    try {
        await User.findByIdAndDelete((req.params.id), (err, result) => {
            if (err) next(error)
            res.json({successful: true ,message: 'User was deleted' });
        })
    }
    catch {
        next(error)
        throw error

    }
})
module.exports = router
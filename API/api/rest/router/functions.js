const express = require('express');
const router = express.Router();
const Function = require('../../../models/Function');
const withAuth = require('../middleware/withAuth');
const createError = require('http-errors');
const functionsService = require('../../../services/function');


router.get('/', withAuth, async (req, res, next) => {
    try {
        var platform = req.query.platform
        const result = await Function.find({platform}).exec();
        await res.json(result);
    }
    catch (error) {
        next(error)
        throw error
    }
})
router.post('/add', withAuth , async (req, res, next) => {
    try {
        const { body } = req
        if(!body.platform) {
            next(createError(400, 'Platform was empty'))
            return
        }
        if (!body.group) {
            next(createError(400, 'Groupname was empty'))
            return
        }
        if (!body.choice) {
            next(createError(400, 'Choice was empty'))
            return
        }
        const result = await functionsService.addFunction(req.body)
        await res.json(result);
    }
    catch (error) {
        throw error
    }
})
router.get('/:id', withAuth, async (req, res, next) => {
    try {
        console.log(req.params.id)
        var idGroup = req.params.id
        await Function.findById((idGroup), (error, result) => {
            if (error) next(createError(404 ,'Not Found'))
            res.json(result);
        })
    }
    catch (error) {
        next(error)
        throw error
    }
})
router.put('/:id/edit', withAuth, async (req, res, next) => {
    try {
        console.log(req.params.id);
        const result = await functionsService.editFunction(req.params.id, req.body)
        res.json(result);
    }
    catch (error) {
        next(error)
        throw error
    }
})
router.delete('/:_id', withAuth, async (req, res, next) => {
    try {
        await Function.findByIdAndDelete((req.params._id), (err, result) => {
            if (err) next(error)
            result = { message: 'Function is deleted' }
            res.json(result);
        })
    }
    catch {
        next(error)
        throw error

    }
})

module.exports = router
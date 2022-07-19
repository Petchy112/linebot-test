const express = require('express');
const router = express.Router();
const {Function} = require('../../../models/Function');
const withAuth = require('../middleware/withAuth');
const createError = require('http-errors');
const functionsService = require('../../../services/function');


router.get('/list', withAuth, async (req, res, next) => {
    try {
        let platform = req.query.platform
        console.log(platform);
        let result
        if(platform != 'undefined') {
            result = await Function.find({platform}).exec();
        }else {
            result = await Function.find().exec();
        }
        await res.json({
            successful: true,
            functionLists: result
        });
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
        if (!body.choices) {
            next(createError(400, 'Choice was empty'))
            return
        }
        const result = await functionsService.addFunction(req.body)
        await res.json({result});
    }
    catch (error) {
        throw error
    }
})
router.get('/:id', withAuth, async (req, res, next) => {
    try {
        let idGroup = req.params.id
        await Function.findById((idGroup), (error, result) => {
            if (error) {
                next(createError(404 ,'Not Found'))
            }
            res.json({
                successful: true,
                functionLists: result
            });
        })
    }
    catch (error) {
        next(error)
        throw error
    }
})
router.put('/:id/edit', withAuth, async (req, res, next) => {
    try {
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
            if (err){
                 next(error)
            }
            res.json({
                successful:true, message: 'Function was deleted' 
            });
        })
    }
    catch {
        next(error)
        throw error

    }
})

module.exports = router
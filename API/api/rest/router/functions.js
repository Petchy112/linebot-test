const express = require('express');
const router = express.Router();
const Function = require('../../../models/functionModel');
const withAuth = require('../middleware/withAuth');
const createError = require('http-errors');
const functionsService = require('../../../services/function');


router.get('/all', async (req, res, next) => {
    try {
        const result = await Function.find().exec();
        await res.json(result);
    }
    catch (error) {
        next(error)
        throw error
    }
})
router.post('/add', async (req, res, next) => {
    try {
        const result = await functionsService.addFunction(req.body)
        await res.json(result);
    }
    catch (error) {
        next(error)
        throw error
    }
})
router.get('/:id', async (req, res, next) => {
    try {
        console.log(req.params.id)
        var idGroup = req.params.id
        await Function.findById((idGroup), (err, result) => {
            res.json(result);
        })
    }
    catch {
        next(error)
        throw error
    }
})
router.put('/:id/edit', async (req, res, next) => {
    try {
        console.log(req.params.id);
        const result = await functionsService.editFunction(req.params.id, req.body)
        res.json(result);
    }
    catch {
        next(error)
        throw error
    }
})

module.exports = router
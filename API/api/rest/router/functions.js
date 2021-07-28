const express = require('express');
const router = express.Router();
const validate = require('validator');
const Function = require('../../../models/functionModel')
const path = require('path')
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

module.exports = router
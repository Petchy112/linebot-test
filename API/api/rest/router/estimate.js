const express = require('express');
const router = express.Router();
const withAuth = require('../middleware/withAuth');
const Estimated = require('../../../models/EstimateResult');
const functionsService = require('../../../services/function');

router.get('/list', withAuth,  async (req, res, next) => {
    try {
        const result = await Estimated.find().exec()
        res.json({
            successful: true,
            estimateList: result
        });
    }
    catch (error) {
        next(error)
        throw error
    }
})
router.get('/:id/detail', withAuth, async (req, res, next) => {
    try {
        console.log(req.params.id);
        var sid = req.params.id
        const result = await Estimated.findById({_id:sid})
        res.json(result);
    }
    catch (error) {
        next(error)
        throw error
    }
})
router.post('/save', withAuth, async (req, res, next) => {
    try {
        const result = await functionsService.saveEstimate(req.userId, req.body)
        res.json(result);
    }
    catch (error) {
        next(error)
        throw error
    }
})


module.exports = router
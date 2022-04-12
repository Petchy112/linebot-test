const express = require('express');
const router = express.Router();
const withAuth = require('../middleware/withAuth');
const Estimated = require('../../../models/EstimateResult');
const functionsService = require('../../../services/function');

router.get('/list', withAuth,  async (req, res, next) => {
    try {
        const result = await Estimated.find().exec()
        console.log(result);
        res.json({
            successful: true,
            estimateList: result
        });
    }
    catch {
        next(error)
        throw error
    }
})
router.get('/:id', withAuth, async (req, res, next) => {
    try {
        console.log(req.params.id);
        var sid = req.params.id
        const result = await Estimated.findById({_id:sid})
        res.json(result);
    }
    catch {
        next(error)
        throw error
    }
})
router.post('/save', withAuth, async (req, res, next) => {
    try {
        const result = await functionsService.saveEstimate(req.userId, req.body)
        res.json(result);
    }
    catch {
        next(error)
        throw error
    }
})


module.exports = router
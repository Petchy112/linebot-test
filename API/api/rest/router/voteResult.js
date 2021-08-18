const express = require('express');
const router = express.Router();
const VoteResult = require('../../../models/voteResultModel');
const withAuth = require('../middleware/withAuth');
const createError = require('http-errors');
const voteService = require('../../../services/vote');
const Time = require('../../../models/timeResultModel');

router.get('/result', async (req, res, next) => {
    try {
        const result = await Time.find().exec();
        await res.json(result);
    }
    catch (error) {
        next(error)
        throw error
    }
})
router.post('/:fid/save',withAuth ,async (req, res, next) => {
    try {
        const result = await voteService.saveResult(req.body.choiceId, req.params.fid, req.body)
        await res.json(result);
    }
    catch (error) {
        next (error)
        throw error
    }
})
router.post('/:_fid', withAuth, async (req, res, next) => {
    try {
        const result = await voteService.sentVote(req.userId, req.body.time, req.body.choiceId, req.params._fid)
        await res.json(result);
    }
    catch (error) {
        next (error)
        throw error
    }
})
router.post('/:id', async(req, res, next) => {
    try{
        console.log(req.params.id)
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
            if (err) next(error)
            res.json(result);
        })
    }
    catch {
        next(error)
        throw error
    }
})
module.exports = router
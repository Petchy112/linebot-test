const express = require('express');
const router = express.Router();
const VoteResult = require('../../../models/voteResultModel');
const withAuth = require('../middleware/withAuth');
const createError = require('http-errors');
const voteService = require('../../../services/vote');
const Time = require('../../../models/timeResultModel');

router.get('/', async (req, res, next) => {
    try {
        const result = await VoteResult.find().exec();
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
        var id = req.params.id
        await VoteResult.findById((id), (err, result) => {
            if (err) next(error)
            res.json(result);
        })
    }
    catch (error) {
        next(error)
        throw error
    }
})
router.post('/:_fid/save', withAuth, async (req, res, next) => {
    try {
        const result = await voteService.sentVote(req.userId, req.body, req.params._fid)
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
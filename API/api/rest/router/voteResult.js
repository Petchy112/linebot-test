const express = require('express');
const router = express.Router();
const VoteResult = require('../../../models/voteResultModel');
const withAuth = require('../middleware/withAuth');
const createError = require('http-errors');
const voteService = require('../../../services/vote');
const Time = require('../../../models/timeResultModel');

router.get('/', async (req, res, next) => {
    try {
        platform = req.query.platform
        const result = await VoteResult.find({platform}).exec();
        await res.json(result);
    }
    catch (error) {
        next(error)
        throw error
    }
})
router.get('/:date', async (req, res, next) => {
    try {
        console.log(req.params.date)
        var date = req.params.date
        const result = await VoteResult.find({ votingDate:date }).exec()
        res.json(result);
    }
    catch (error) {
        next(error)
        throw error
    }
})
router.post('/:fid/save', withAuth, async (req, res, next) => {
    try {
        const result = await voteService.sentVote(req.userId, req.body, req.params.fid)
        await res.json(result);
    }
    catch (error) {
        next (error)
        throw error
    }
})

// router.get('/:id', async (req, res, next) => {
//     try {
//         console.log(req.params.id)
//         var idGroup = req.params.id
//         await Function.findById((idGroup), (err, result) => {
//             if (err) next(error)
//             res.json(result);
//         })
//     }
//     catch {
//         next(error)
//         throw error
//     }
// })
module.exports = router
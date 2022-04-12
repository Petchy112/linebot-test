const express = require('express');
const router = express.Router();
const VoteResult = require('../../../models/VoteResult');
const withAuth = require('../middleware/withAuth');
const createError = require('http-errors');
const voteService = require('../../../services/vote');
const Function = require('../../../models/Function');
const moment = require('moment');
// const sortHelper = require('../../../helper/sortArrByDate'); 


function sortHelper(a,b) {
    if (a.createdAt < b.createdAt) {
        return 1
    }
    if (a.createdAt > b.createdAt) {
        return -1
    }
    return 0
}

router.get('/list', async (req, res, next) => {
    try {
        const rawResult = await VoteResult.find().exec()
        let data = []
        rawResult.map(async item => {
            await data.push({
                    id: item._id,
                    round: item.voteRound,
                    createdAt : moment(item.createdAt).format('DD MMM YYYY')
                })
        })
        
        await res.json({successful: true, result_list: data.sort(sortHelper)});
    }
    catch (error) {
        next(error)
        throw error
    }
})
router.get('/result', async (req, res, next) => {
    try {
        var platform = req.query.platform
        const result = await VoteResult.find({platform}).exec()
        await res.json(result);
    }
    catch (error) {
        next(error)
        throw error
    }
})
router.get('/:id/detail', async (req, res, next) => {
    try {
        // const round = req.params.id
        // const platform = req.query.platform
        const result = await voteService.getVoteDetail(req.params.id, req.query.platform)
        await res.json(result);
    }
    catch (error) {
        next(error)
        throw error
    }
})
router.post('/save', withAuth, async (req, res, next) => {
    try {
        const result = await voteService.sentVote(req.userId, req.body)
        await res.json(result);
    }
    catch (error) {
        next (error)
        throw error
    }
})
router.post('/controlVote', withAuth, async (req, res, next) => {
    try {
        let action = req.query.action
        if(action=='OPEN') {
            const result = await voteService.ChangeStatusToOpen(action);
            res.json(result);
        }
        if (action=='CLOSE') {
            const result = await voteService.ChangeStatusToClose(action);
            res.json(result);
        }
        
    }
    catch (error) {
        next(error)
        throw error
    }
})
module.exports = router
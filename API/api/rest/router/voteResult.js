const express = require('express');
const router = express.Router();
const VoteResult = require('../../../models/voteResultModel');
const withAuth = require('../middleware/withAuth');
const createError = require('http-errors');
const voteService = require('../../../services/vote');
const Function = require('../../../models/functionModel');


router.get('/', async (req, res, next) => {
    try {
        var platform = req.query.platform
        const rawResult = await VoteResult.find().exec()
        var data = []
        rawResult.map(item => {
            data.push(item.voteRound)
        })
        const distinct = (value,index,self) => {
            return self.indexOf(value) === index
        }
        const result = data.filter(distinct)
        await res.json(result);
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
router.get('/:round', async (req, res, next) => {
    try {
        var round = req.params.round
        var platform = req.query.platform
        const result = await voteService.getResult(round, platform)
        await res.json(result);
    }
    catch (error) {
        next(error)
        throw error
    }
})
// router.get('/:date', async (req, res, next) => {
//     try {
//         var platform = req.query.platform
//         var date = req.params.date
//         const result = await VoteResult.find({ $and: [ { votingDate:date  }, { platform } ] })
//         res.json(result);
//     }
//     catch (error) {
//         next(error)
//         throw error
//     }
// })
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
router.post('/controlVote', async (req, res, next) => {
    try {
        let action = req.query.action
        if(action=='start') {
            const result = await voteService.ChangeStatusToON();
            res.json(result);
        }
        if (action=='stop') {
            const result = await voteService.ChangeStatusToOFF();
            res.json(result);
        }
        
    }
    catch (error) {
        next(error)
        throw error
    }
})
module.exports = router
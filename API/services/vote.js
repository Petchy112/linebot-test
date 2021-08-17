const Time = require('../models/timeResultModel');
const Function = require('../models/functionModel');
const createError = require('http-errors');

const voteService = {
    async saveResult(uid, fid, input) {
        console.log(fid,input);

        await Function.findByIdAndUpdate({ _id:fid },{
            choice : input['choice']
        })
        
        var result = { message:'Sent result successful!'}
        return result
        
    },
    async sentVote(uid,input,_id) {
        console.log(input);
        
        const rawTime = await Time.findById({_id});
        
        rawTime.userId.push(uid)
        rawTime.time.push(input)
        await rawTime.save()
        
        
        let sum = 0; 
        for (let i = 0; i < rawTime.time.length; i++) 
                sum += rawTime.time[i]; 
        rawTime.totalTime = sum/rawTime.time.length
        await rawTime.save()

        var result = { message:'Sent result successful!',time:sum/rawTime.time.length }
        return result
        
    },
    async startVote() {
        const vote = new Time();
        await vote.save()
        if (vote){
            return {message:'Start Voting'}
        }
        
    }
}

module.exports = voteService
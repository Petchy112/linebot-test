const Time = require('../models/timeResultModel');
const Function = require('../models/functionModel');
const createError = require('http-errors');

const voteService = {
    async saveResult(cid, fid, input) {
        console.log(fid,input);

        const data = await Function.findById({ _id:fid })
        console.log(data.choice)
            
        let reformattedArray = data.choice.map(item => {
            let rData = {}
            rData[item._id] = [{id: item._id,name:item.name}]
            return rData
        })
        console.log(reformattedArray)
    },
    async sentVote(uid, input, chId, _id) {
        console.log(input);
        
        var createdChoice = await Time.findOne({ choiceId:chId })
        if(!createdChoice){
            console.log('Not Found');
            const newResult = new Time();
            newResult.choiceId = chId,
            newResult.userId = uid,
            newResult.time = input,
            newResult.totalTime = input
            await newResult.save()
        }
        else if(createdChoice){
            console.log('found');
            createdChoice.choiceId = chId,
            createdChoice.userId.push(uid),
            createdChoice.time.push(input)
            

            let sum = 0;
            for (let i = 0; i < createdChoice.time.length; i++) 
                sum += createdChoice.time[i]; 
            createdChoice.totalTime = sum/createdChoice.time.length
            await createdChoice.save()
        }
        
        var result = { message:'Sent result successful!'}
        return result
        
    },
    
}

module.exports = voteService
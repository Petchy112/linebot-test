const Time = require('../models/timeResultModel');
const Function = require('../models/functionModel');
const createError = require('http-errors');
const VoteResult = require('../models/voteResultModel');

const voteService = {
    async sentVote(uid, input, fid) {
        console.log(fid);
        
        var createdChoice = await Time.findOne({ choiceId:input.choiceId })
        if(!createdChoice) {
            console.log('Not Found');
            const newResult = new Time();
            newResult.choiceId = input.choiceId,
            newResult.name = input.name
            newResult.userId = uid,
            newResult.time = input.time,
            newResult.totalTime = input.time
            await newResult.save()
        }
        else if(createdChoice) {
            console.log('Found');
            createdChoice.choiceId = input.choiceId,
            createdChoice.name = input.name,
            createdChoice.userId.push(uid),
            createdChoice.time.push(input.time)
            
            let sum = 0;
            for (let i = 0; i < createdChoice.time.length; i++) 
                sum += createdChoice.time[i]; 
            createdChoice.totalTime = sum/createdChoice.time.length
            await createdChoice.save()
            
        }
        const data = await Function.findById(fid)
        const a = []
        console.log(data.choice)
        await data.choice.map(e => {
            a.push({id:e._id,name:e.name})
        })
        const z = []
        const n = []
        a.map(i =>{
            z.push(i.id)
            n.push(i.name)
        })
        t = []
        const b = await Time.find({ choiceId: z })
        b.map(item => {
            t.push({name:item.name,time: item.totalTime})
        });
        console.log(t);
        
        const setTime = await VoteResult.findOne({ functionId:fid })
        setTime.choice = t,
        date = new Date()
        setTime.votingDate = date
            await setTime.save()

        var result = { message:'Sent result successful!'}
        return result
        
    },
    
}

module.exports = voteService
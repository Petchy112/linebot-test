const Time = require('../models/Time');
const Function = require('../models/Function');
const createError = require('http-errors');
const VoteResult = require('../models/VoteResult');

const voteService = {
    async ChangeStatusToClose(action) {
        console.log(action)
        console.log('change vote status called');
        const result = await Function.find({status : 'OPEN'})
            await result.forEach(async doc => {
                if (doc.status == 'OPEN') {
                        doc.status = 'CLOSE';
                    await doc.round++;
                }
                    doc.save();
                });

        return { message : 'Voting is already close'}
    },
    async ChangeStatusToOpen(action) {

        console.log('change vote status called', action);
        const result = await Function.find({status : 'CLOSE'})
            await result.forEach(doc => {
                if (doc.status == 'CLOSE') {
                    doc.status = 'OPEN';
                }
                    doc.save();
                });

        return { message : 'Voting is already open'}
    },
    async sentVote(uid, input) {
        for (let round = 0; round < input.body.length; round++) {
            const functionData = await Function.findById(input.body[round].fid)
            if(functionData.status == 'CLOSE') {
                throw createError(400, 'Voting is closed')
            }
            console.log('choice : ',input.body[round].choiceId);
            
            var createdChoice = await Time.findOne({ choiceId: input.body[round].choiceId })
            if(!createdChoice) {
                const newResult = new Time();
                    newResult.choiceId = input.body[round].choiceId,
                    newResult.name = input.body[round].name
                    newResult.description = input.body[round].description
                    newResult.imagePath = input.body[round].imagePath
                    newResult.userId = uid,
                    newResult.time = input.body[round].time,
                    newResult.totalTime = input.body[round].time
                await newResult.save()
            }
            else if(createdChoice) {
                createdChoice.choiceId = input.body[round].choiceId,
                createdChoice.name = input.body[round].name,
                createdChoice.description = input.body[round].description
                createdChoice.imagePath = input.body[round].imagePath
                createdChoice.userId.push(uid),
                createdChoice.time.push(input.body[round].time)
                    
                let sum = 0;
                for (let i = 0; i < createdChoice.time.length; i++) 
                    sum += createdChoice.time[i]; 
                createdChoice.totalTime = sum/createdChoice.time.length
                await createdChoice.save()         
            }
        
            
        
            const getName = []
            await functionData.choice.map(el => {
                getName.push({id:el._id, name:el.name})
            })
            const getChoice = []
                
            await getName.map(i =>{
                getChoice.push(i.id)    
            })

            const rawData = []
            const choiceHaveTime = await Time.find({ choiceId: getChoice })
            choiceHaveTime.map(async item => {
                await rawData.push({name:item.name, description: item.description ,imagePath: item.imagePath ,time: item.totalTime})
            });
            
            const update = await VoteResult.findOne({functionId:input.body[round].fid})
            console.warn(update);
            if(update) {
                console.log('found');
                update.choices = rawData
                    await update.save()
            }
            if (update==null) {
                console.log('not found');
                const setTime = new VoteResult()
                setTime.platform = functionData.platform
                setTime.functionId = input.body[round].fid
                setTime.group = functionData.group
                setTime.choices = rawData
                setTime.voteRound = functionData.round
                console.log(setTime);
                    await setTime.save()
            }
        }
        var result = { message:'Sent result successful!'}
        return result
        
    },
    async getResult(voteRound, platform) {
        const data = await VoteResult.find({ $and: [ { voteRound  }, { platform } ] }).exec()
        console.log(data);
        raw = []
        data.map(ele => {
            raw.push(
                {voteRound, data:{group:ele.group,choices:ele.choices}})  
        })

        return raw;
    }
}

module.exports = voteService
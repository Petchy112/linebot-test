const Time = require('../models/Time');
const {Function, status}  = require('../models/Function');
const createError = require('http-errors');
const VoteResult = require('../models/VoteResult');
const pushMessageService = require('../services/webhook')

const voteService = {
    async ChangeStatus() {
        console.log('change vote status called');
        const result = await Function.find().exec()
        await result.forEach(async (doc) => {
            if (doc.status == 'CLOSE') {
                doc.status = await status.OPEN
            }
            else {
                doc.status = await  status.CLOSE
            }
                await doc.save();
                await pushMessageService.pushVotingMessage();
            });

        return { successful: true, message : 'update status successful' , data: result}
    },
    async sentVote(uid, input) {
        for (let round = 0; round < input.body.length; round++) {
            const functionData = await Function.findById(input.body[round].fid)
            if(functionData.status == 'CLOSE') {
                throw createError(400, 'Voting is closed')
            }
            
            const createdChoice = await Time.findOne({ choiceId: input.body[round].choiceId })
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
            await functionData.choices.map(el => {
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
            if (update == null) {
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
        return { successful: true, message:'Sent result successful'}
        
    },
    async getVoteDetail(id, platform) {
        console.log('get vote detail called', id);
        const voteResult = await VoteResult.find({ $and: [ { _id:id }, { platform } ] }).exec()
        
        const result = await Promise.all(voteResult.map(async item => {
            return {
                choices: item.choices,
                platform: item.platform,
                functionId: item.functionId,
                group: item.group,
            }
        })
        )
        return { successful :true , data: result };
        
        
        
        // console.log(result);
        
    }
}

module.exports = voteService
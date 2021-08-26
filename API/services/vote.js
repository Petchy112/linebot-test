const Time = require('../models/timeResultModel');
const Function = require('../models/functionModel');
const createError = require('http-errors');
const VoteResult = require('../models/voteResultModel');

const voteService = {
    async sentVote(uid, input, fid) {
        for (let round = 0; round < input.body.length; round++) {
            console.log(input.body[round].choiceId);
            var createdChoice = await Time.findOne({ choiceId:input.body[round].choiceId })
            console.log(createdChoice);
            if(!createdChoice) {
                console.log('Not Found');
                const newResult = new Time();
                    newResult.choiceId = input.body[round].choiceId,
                    newResult.name = input.body[round].name
                    newResult.userId = uid,
                    newResult.time = input.body[round].time,
                    newResult.totalTime = input.body[round].time
                await newResult.save()
            }
            else if(createdChoice) {
                console.log('Found');
                    createdChoice.choiceId = input.body[round].choiceId,
                    createdChoice.name = input.body[round].name,
                    createdChoice.userId.push(uid),
                    createdChoice.time.push(input.body[round].time)
                    
                    let sum = 0;
                    for (let i = 0; i < createdChoice.time.length; i++) 
                        sum += createdChoice.time[i]; 
                    createdChoice.totalTime = sum/createdChoice.time.length
                    await createdChoice.save()
                    
                }
            }
            const functionData = await Function.findById(fid)
            const getName = []
            console.log(functionData.choice)
            await functionData.choice.map(el => {
                getName.push({id:el._id,name:el.name})
            })
            const getChoice = []
            
            getName.map(i =>{
                getChoice.push(i.id)
                
            })
            const data = []
            const choiceHaveTime = await Time.find({ choiceId: getChoice })
            choiceHaveTime.map(item => {
                data.push({name:item.name,time: item.totalTime})
            });
            console.log(data);
        
            const setTime = await VoteResult.findOne({ functionId:fid })
            console.log(setTime)
            setTime.choices = data
            await setTime.save()

            var result = { message:'Sent result successful!'}
            return result
        
    },
    
}

module.exports = voteService
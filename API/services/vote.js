const Time = require('../models/timeResultModel');
const Function = require('../models/functionModel');
const createError = require('http-errors');
const VoteResult = require('../models/voteResultModel');

const voteService = {
    // async sentVoteClose(uid, input, fid) {
    //     const functionData = await Function.findById(fid)
    //     if(functionData.status == 'CLOSE') {
    //         throw createError(400, 'Voting is closed')
    //     }
    //     for (let round = 0; round < input.body.length; round++) {
    //         console.log('choice : ',input.body[round].choiceId);
            
    //         var createdChoice = await Time.findOne({ choiceId:input.body[round].choiceId })
    //         if(!createdChoice) {
    //             const newResult = new Time();
    //                 newResult.choiceId = input.body[round].choiceId,
    //                 newResult.name = input.body[round].name
    //                 newResult.userId = uid,
    //                 newResult.time = input.body[round].time,
    //                 newResult.totalTime = input.body[round].time
    //             await newResult.save()
    //         }
    //         else if(createdChoice) {
    //             createdChoice.choiceId = input.body[round].choiceId,
    //             createdChoice.name = input.body[round].name,
    //             createdChoice.userId.push(uid),
    //             createdChoice.time.push(input.body[round].time)
                    
    //             let sum = 0;
    //             for (let i = 0; i < createdChoice.time.length; i++) 
    //                 sum += createdChoice.time[i]; 
    //             createdChoice.totalTime = sum/createdChoice.time.length
    //             await createdChoice.save()         
    //         }
    //     }   // สร้างข้อมูลใน database Time เสร็จแล้ว
            
    //     // อัพเดต ฐานข้อมูลใน VoteResult
    //     const getName = []
    //     await functionData.choice.map(el => {
    //         getName.push({id:el._id, name:el.name})
    //     })
    //     const getChoice = []
            
    //     await getName.map(i =>{
    //         getChoice.push(i.id)    
    //     })

    //     const rawData = []
    //     const choiceHaveTime = await Time.find({ choiceId: getChoice })
    //     choiceHaveTime.map(item => {
    //         rawData.push({name:item.name, time: item.totalTime})
    //     });
        
            
    //     const data = {
    //         functionId: fid,
    //         group: functionData.group,
    //         platform: functionData.platform,
    //         choices: rawData
    //     }
    //     console.log(data);
    //     const checkRound = await VoteResult.findOne({ voteRound: functionData.round })
    //     if(checkRound) {
    //         var indexObj = null
    //         for (let j = 0; j < checkRound.result.length; j++) {
    //             console.log(j);
    //             console.log(checkRound.result[j].functionId)
    //             if(checkRound.result[j].functionId == fid) {
    //                 indexObj = j
    //             }
    //         } 
            
    //         console.log('อยู่ในอินเดค ',indexObj);
            
    //         if (indexObj != null) {
    //             console.log('Found');
    //             await VoteResult.findOneAndReplace(
    //                 { 'voteRound': functionData.round },
    //                 {
    //                     "result[indexObj]":[ {
                            
    //                         "choices": rawData
                        
    //                 }]
    //                 } ,
    //                     {new: false}
    //                 )
    //         }
    //         if (indexObj == null) {
    //             console.log('Not found');
    //             checkRound.result.push(data)
    //             console.log(checkRound.result)
    //                 await checkRound.save()
    //         }   
    //     }
    //     else if(!checkRound) {
    //         console.log('not found vote round');
    //         const setTime = new VoteResult()
    //         setTime.voteRound = functionData.round
    //         setTime.result.push(data)
    //             await setTime.save()
    //     }

    
    //     var result = { message:'Sent result successful!'}
    //     return result
        
    // },
    async ChangeStatusToClose(action) {
        console.log(action)
        console.log('change vote status called');
        const result = await Function.find({status : 'OPEN'})
            await result.forEach(doc => {
                if (doc.status == 'OPEN') {
                    doc.status = 'CLOSE';
                    doc.round++;
                }
                    doc.save();
                });

        return { message : 'Voteing is already close'}
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

        return { message : 'Voteing is already open'}
    },
    async sentVote(uid, input, fid) {
        const functionData = await Function.findById(fid)
        if(functionData.status == 'CLOSE') {
            throw createError(400, 'Voting is closed')
        }
        for (let round = 0; round < input.body.length; round++) {
            console.log('choice : ',input.body[round].choiceId);
            
            var createdChoice = await Time.findOne({ choiceId:input.body[round].choiceId })
            if(!createdChoice) {
                const newResult = new Time();
                    newResult.choiceId = input.body[round].choiceId,
                    newResult.name = input.body[round].name
                    newResult.userId = uid,
                    newResult.time = input.body[round].time,
                    newResult.totalTime = input.body[round].time
                await newResult.save()
            }
            else if(createdChoice) {
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
        choiceHaveTime.map(item => {
            rawData.push({name:item.name, time: item.totalTime})
        });
        
        const update = await VoteResult.findOne({functionId:fid})
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
            setTime.functionId = fid
            setTime.group = functionData.group
            setTime.choices = rawData
            setTime.voteRound = functionData.round
            console.log(setTime);
                await setTime.save()
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
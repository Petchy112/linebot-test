const {Function} = require('../models/Function');
const Estimated = require('../models/EstimateResult');
const User = require('../models/User');
const VoteResult = require('../models/VoteResult')
const createError = require('http-errors');

const functionsService = {
    async addFunction(input) {
        console.log('add function called', input)
        const checkStatus = await Function.find({status : 'OPEN'})
        if(checkStatus.length != 0) {
            return {
                successful: false,
                message: 'Please turn off voting before adding new functions'
            }
        }
        const checkRound = await Function.findOne({"status":"CLOSE"})
        if(checkRound.round) {
            const functionData = new Function();
            functionData.group = input.group,
            functionData.choices = input['choices'],
            functionData.platform = input.platform
            functionData.round = checkRound.round
                await functionData.save()

            if (functionData) {
                return { successful: true, message: 'Add function successful' ,id:functionData._id }
            }
        }
        return { successful: false, message: 'Something went wrong!' }

    },
    async editFunction(id, input) {
        console.log('edit function called', id,input);
        await Function.findByIdAndUpdate( id , {
            group: input.group,
            choices: input['choice']
        })
        await VoteResult.findOneAndUpdate({ functionId: id }, {
            group: input.group,
            
        })
        return { successful: true, message: 'edit successfully' }
    },
    async saveEstimate(uid, result) {
        console.log('save estimate called', result);

        const user = await User.findOne({ userId: uid })
        const estimatedData = new Estimated()
        estimatedData.projectName = result.projectName,
            estimatedData.choice = result['selectedChoice'],
            estimatedData.createBy = user.firstname,
            estimatedData.platform = result.platform,
            estimatedData.estimatedTime = result.estimateTime
            estimatedData.size = result.size,
            estimatedData.qty = result.qty

        var isExistName = await Estimated.findOne({ projectName: result.projectName })
        if (isExistName) {
            return createError(400, 'Project name is exist')
        }
        estimatedData.save()
        return { message: 'Save time success' }




    }
}
module.exports = functionsService
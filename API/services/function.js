const Function = require('../models/functionModel');
const Estimated = require('../models/estimatedModel');
const User = require('../models/userModel');
const VoteResult = require('../models/voteResultModel')
const createError = require('http-errors');

const functionsService = {
    async addFunction(input) {
        console.log('add function called', input)

        const functionData = new Function();
        functionData.group = input.group,
        functionData.choice = input['choice'],
        functionData.platform = input.platform
            await functionData.save()


        if (functionData) {
            return { message: 'Add function successful' ,id:functionData._id }
        }
        return { message: 'Something went wrong!' }

    },
    async editFunction(id, input) {
        console.log('edit function called', id);
        console.log(input)
        await Function.findByIdAndUpdate({ _id: id }, {
            group: input.group,
            choice: input['choice']
        })
        await VoteResult.findByOneAndUpdate({ functionId: id }, {
            group: input.group,
            
        })
        return { message: 'Edit success' }
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
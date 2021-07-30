const Function = require('../models/functionModel');
const Estimated = require('../models/estimatedModel');
const User = require('../models/userModel');
const createError = require('http-errors');

const functionsService = {
    async addFunction(input) {
        console.log('add function called', input)

        const data = new Function();
        data.group = input.group,
            data.choice = input['choice'],
            await data.save()

        if (data) {
            return { message: 'Add function successful' }
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
        return { message: 'Edit success' }
    },
    async saveEstimate(uid, result) {
        console.log('save estimate called', result);

        const user = await User.findOne({ userId: uid })
        const estimatedData = new Estimated()
        estimatedData.projectName = result.projectName,
            estimatedData.choice = result['choice'],
            estimatedData.createBy = user.firstname,
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
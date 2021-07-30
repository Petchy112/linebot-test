const Function = require('../models/functionModel')

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
    }
}
module.exports = functionsService
const restAPI = require('./api/rest/index')
const database = require('./database')

const run = async () => {
    await database()
    restAPI()
}
run();
const restAPI = require('./api/rest/index')
const database = require('./database')
const  { EventEmitter } = require('events')
EventEmitter.defaultMaxListeners = 25



const run = async () => {
    database()
    await restAPI()
}
run();
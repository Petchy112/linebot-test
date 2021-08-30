const functions = require('./functions');
const user = require('./user');
const estimate = require('./estimate');
const voteResult = require('./voteResult')
const image = require('./image')


module.exports = app => {
    app.use('/function', functions)
    app.use('/user', user)
    app.use('/estimate', estimate)
    app.use('/vote', voteResult)
    app.use('/image', image)
   
}
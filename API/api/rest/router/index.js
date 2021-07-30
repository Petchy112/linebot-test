const functions = require('./functions');
const user = require('./user');
const estimate = require('./estimate');


module.exports = app => {
    app.use('/function', functions)
    app.use('/user', user)
    app.use('/estimate', estimate)
}
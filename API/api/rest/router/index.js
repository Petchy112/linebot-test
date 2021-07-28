const functions = require('./functions');
const user = require('./user')

module.exports = app => {
    app.use('/function', functions)
    app.use('/user', user)
}
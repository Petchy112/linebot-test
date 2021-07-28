const mongoose = require('mongoose')
const config = require('./config')

module.exports = async () => {
    try {
        const connection = `mongodb+srv://${config.database.username}:${config.database.password}@${config.database.host}/${config.database.database}`
        await mongoose.connect(connection, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('Database Connected');
    }
    catch (err) {
        console.log('Database can not connect');
    }
}

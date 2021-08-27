require('dotenv').config()

module.exports = config = {
    PORT: process.env.PORT || 4000,
    database: {
        username: 'admin',
        password: '15918Petch',
        host: 'testmongodb.fs0qx.mongodb.net',
        database: 'estimated_time'
    },
    auth: {
        expireIn: {
            accessToken: 60 * 60
        }
    },
    line: {
        channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
        channelSecret: process.env.CHANNEL_SECRET,
    },
    session: {
        JWT: {
            issuer: process.env.JWT_ISSUER,
            algorithm: process.env.JWT_ALGORITHM
        },
        key: process.env.SESSION_KEY
    }
}
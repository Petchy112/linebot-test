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
        channelAccessToken: 'jEPtX0y6WXHYpVYko29scxq99tQUvFGL5aXkkklJWP37LzdRkmGO8X4uq4RaVmUa4cm9vQKhyHKCYmSoFPXIGQd7PEOperXxxbEyQxV59BOCJqBc7Bybt0jFUN7mgIxeh1376Cn6NSss+rC1JzF8vAdB04t89/1O/w1cDnyilFU=',
        channelSecret: '7223327682146545ad0bb1835014ec46',
    },
    session: {
        JWT: {
            issuer: 'JWT',
            algorithm: 'HS256'
        },
        key: 'secret'
    }
}
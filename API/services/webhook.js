const User = require('../models/User')
const createError = require('http-errors')
const axios = require('axios')
const createHttpError = require('http-errors')

const webhookService = {
    async pushVotingMessage() {
        console.log('push voting msg')
        const users = await User.find({ role : "VOTER" }).exec()
        users.forEach(async user => {
            if(user.lineUserId && user.lineUserId != null) {
                const body = JSON.stringify({
                    to: 'Uecebfbd1db9785ce9a8254590bc502d5',
                    messages: [
                        {
                            type: "flex",
                            altText: "คุณได้รับข้อความใหม่",
                            contents: {
                                "type": "bubble",
                                "size": "mega",
                                "body": {
                                    "type": "box",
                                    "layout": "vertical",
                                    "spacing": "sm",
                                    "contents": [
                                        {
                                            "type": "text",
                                            "text": "แจ้งเตือนระบบ",
                                            "weight": "bold",
                                            "size": "xl",
                                            "wrap": true,
                                            "contents": [],
                                        },
                                        {
                                            "type": "box",
                                            "layout": "vertical",
                                            "spacing": "lg",
                                            "margin": "sm",
                                            "contents": [
                                                {
                                                    "type": "text",
                                                    "text": "ขณะนี้ระบบโหวตได้เปิดแล้ว กรุณาอัพเดตเวลาของคุณ ขอบคุณค่ะ",
                                                    "weight": "regular",
                                                    "size": "md",
                                                    "color": "#000000A6",
                                                    "margin": "none",
                                                    "wrap": true,
                                                    "contents": [],
                                                },
                                                {
                                                    "type": "spacer",
                                                },
                                            ],
                                        },
                                    ],
                                },
                            },
                        } 
                    ],
                })
        
        
                const config = {
                    method: 'post',
                    url: 'https://api.line.me/v2/bot/message/push',
                    headers: {
                        'Authorization': 'Bearer jEPtX0y6WXHYpVYko29scxq99tQUvFGL5aXkkklJWP37LzdRkmGO8X4uq4RaVmUa4cm9vQKhyHKCYmSoFPXIGQd7PEOperXxxbEyQxV59BOCJqBc7Bybt0jFUN7mgIxeh1376Cn6NSss+rC1JzF8vAdB04t89/1O/w1cDnyilFU=',
                        'Content-Type': 'application/json',
                    },
                    data: body,
                }
                try{
                    await axios(config)
                }
                catch (error) {
                    console.log(error)
                }
            }
        })
        return
    },
}
module.exports = webhookService
const line = require('@line/bot-sdk');
const express = require('express');
require('dotenv').config();
const request = require('request-promise');

const LINE_MESSAGING_API = 'https://api.line.me/v2/bot';
const LINE_HEADER = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer cZ2txqYRfSWaY6SnbA1RcLvM11lljwzCEiNLaI9oQzs0PkaLpxQOdtoOvn1vmGKeuy+2f9E+DmPyT7SuEaYupPC73W0PzP+9ui9NpQGoANHvj0RZPPMKIkxqE0DdRMbT7QOFzVuwd105m2DV3pDm6wdB04t89/1O/w1cDnyilFU=`
};

// create LINE SDK config from env variables
const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET,
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');


app.get('/RichMenu', (req, res) => {
    res.send('hi there 555');
})
app.get('/login', (req, res) => {
    res.render('index');
})
// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', (req, res) => {
    if (req.body.events[0].message.type !== 'text') {
        return;
    }
    reply(req.body);
});

app.post('/RichMenu', (req, res) => {
    console.log('hi');
    res.header('Access-Control-Allow-Origin', '*')

    let richMenuId1 = 'richmenu-ae3210824cc3171220b18b6b7111f7d2';
    let richMenuId2 = 'richmenu-743b6616650de48e995c1075e4376ccb';

    if (req.body.uid !== undefined) {
        // คุณอาจทำการ auth ด้วย username และ password ที่ผู้ใช้กรอกมา
        // และคุณอาจเก็บข้อมูล uid ลง db เพื่อผูกกับ existing account เดิมที่มีอยู่ในระบบ
        link(req.body.uid, richMenuId1)
    } else {
        let event = req.body.events[0]
        if (event.type === 'postback') {
            switch (event.postback.data) {
                case 'richmenu1': link(event.source.userId, richMenuId1); break
                case 'richmenu2': link(event.source.userId, richMenuId2); break
            }
        }
    }

    return res.status(200).send(req.method)
})

const link = async (uid, richMenuId) => {
    await request.post({
        uri: `https://api.line.me/v2/bot/user/${uid}/richmenu/${richMenuId}`,
        headers: { Authorization: process.env.CHANNEL_ACCESS_TOKEN }
    });
}
const reply = (bodyResponse) => {
    return request({
        method: `POST`,
        uri: `${LINE_MESSAGING_API}/message/reply`,
        headers: LINE_HEADER,
        body: JSON.stringify({
            replyToken: bodyResponse.events[0].replyToken,
            messages: [
                {
                    type: `text`,
                    text: bodyResponse.events[0].message.text
                }
            ]
        })
    });
};

// listen on port
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});
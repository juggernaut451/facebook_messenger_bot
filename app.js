'use strict'
const http = require('http')
const Bot = require('messenger-bot')

let bot = new Bot({
  token: 'token',
  verify: 'VERIFY_TOKEN'
})

function keywordSeperator(p1) {
    var str = p1.toLowerCase();
    str = str.split(" ")
    str = str[2]
    var data = {
        "text":"hello, world!"
    };
    var messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": "Company 1",
          "subtitle": "Element #1 of an hscroll",
          "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
          "buttons": [{
            "type": "web_url",
            "url": "https://ashutoshksingh.com",
            "title": "More info"
          }],
        },{
          "title": "Company 2 ",
          "subtitle": "Element #2 of an hscroll",
          "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
          "buttons": [{
            "type": "web_url",
            "title": "more info",
            "url": "www.google.com",
          }],
        }]
      }
    }
  };

    if (str == "noida"){
      return JSON.stringify(messageData);
    } else {
        return JSON.stringify(data) ;
      }
}

bot.on('error', (err) => {
  console.log(err.message)
})

bot.on('message', (payload, reply) => {
  console.log(payload.message.text);
  let text = keywordSeperator(payload.message.text);

  bot.getProfile(payload.sender.id, (err, profile) => {
    if (err) throw err

    console.log("Got from function: " + text);
    reply(text, (serr, info) => {
        if (serr) {
          console.log(serr);
}
        
    })
  })
})

http.createServer(bot.middleware()).listen(3000)
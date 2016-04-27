'use strict';
const http = require('http');
const Bot = require('messenger-bot');
var request = require('request');

let bot = new Bot({
  token: 'TOKEN',
  verify: 'VERIFY_TOKEN'
});

var dynamic_value = function (profile, text, next){
    var value = {
        "attachment" :{
            "type" : "template",
            "payload" : {
                "template_type" : "generic",
                "elements" : []
            }
        }
    };

    var dyn_value = [];
    request('GET URL/text', function (error, response, body) {
        //Check for error
        if(error){
            return console.log('Error:', error);
        }

        //Check for right status code
        if(response.statusCode !== 200){
            return console.log('Invalid Status Code Returned:', response.statusCode);
        }

        //All is good. Print the body
        // Show the HTML for the Modulus homepage.
        var JsonObject= JSON.parse(body);
        
        for (var x in JsonObject){
            let item = {
              "buttons": []
            }
            let buttons_value = {};
            item ["title"] = JsonObject[x].name;
            item ["image_url"] = JsonObject[x].imageUrl;
            item["subtitle"] = JsonObject[x].subTitle;
            buttons_value["type"] = "web_url";
            buttons_value["title"] = "More info";
            buttons_value["url"] = "http://www.google.com"
            item.buttons.push(buttons_value);
            dyn_value.push(item);

        };

        value.attachment.payload.elements = dyn_value;
        next(JSON.stringify(value));
    });
};



bot.on('error', (err) => {
  console.log(err.message);
});

bot.on('message', (payload, reply) => {
  console.log(payload.message.text);
  let data = payload.message.text;
  bot.getProfile(payload.sender.id, (err, profile) => {  
    dynamic_value(profile, data, function(text){    
          if (err) throw err;
          console.log("Got from function: " + text);
        reply(text, (serr, info) => {
          if (serr) {
              console.log(serr);
          }
        })
    });
  });
});

http.createServer(bot.middleware()).listen(3000);
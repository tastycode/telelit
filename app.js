var tinycolor = require('tinycolor2');
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');


var app = express();

app.use(bodyParser.urlencoded());
app.post('/sms', function(req, res) {

  var text = req.body.Body;
  var color = tinycolor(text);
  var hsl = color.toHsl();
  console.log(text, hsl);
  var hueHue = parseInt((hsl.h / 360.0) * 65535);
  var hueSat = parseInt(hsl.s * 255);
  var hueBri = parseInt(hsl.l * 255.0);

  var accessToken = process.env.HUE_ACCESS_TOKEN;
  var url = 'https://www.meethue.com/api/sendmessage?token=' + accessToken;
  var bridgeId = process.env.BRIDGE_ID;
  var lightId = process.env.LIGHT_ID;

  var clipMessage = {
    bridgeId: bridgeId,
    clipCommand: {
      url: '/api/0/lights/' + lightId + '/state',
      method: 'PUT',
      body: {
        hue: hueHue,
        on: true,
        bri: hueBri,
        sat: hueSat
      }
    }
  };

  if (color.isValid()) {
    res.end();
    request({
      url: url,
      method: 'POST',
      form: {clipmessage: JSON.stringify(clipMessage)}
    }, function(error, response, body) {
      console.log(body);
    });
  } else {
    res.send('<?xml version="1.0" encoding="UTF-8"?><Response><Message>Your color could not be found! Please try “purple”</Message></Response>');
  }
});
var port = process.env.PORT || 8000;
app.listen(port, function() {
  console.log('Listening on ' + port);
});

'use strict';

require('dotenv').config();
var nano = require('./nano-client');
var chat = require('./chat-client');

var shutdown = function() {
  console.log('Shutdown ...');

  nano.stop();
  chat.stop();
};

// Nano client
nano.start(function(data) {
  var params = data.split(': ');

  chat.send(params[0], params[1]);
});

// Chat client
chat.start(function(nick, content) {
  nano.send(nick + ': ' + content);
});

// TERM signal
process.on ('SIGTERM', shutdown);
// INT signal
process.on ('SIGINT', shutdown);

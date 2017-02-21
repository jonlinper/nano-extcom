'use strict';

var config = require('./config');
var io = require('socket.io-client');

var client;
var myNick;
var ivl;
var shutdown = false;
var connected = false;

var connect = function() {
  client = io.connect(config.chatAddress);
};

/**
 * Expose config.
 */
module.exports = {
  start: function(receive) {
    connect();

    client.on('connect', function() {
      console.log('Chat: Connected');

      connected = true;

      clearInterval(ivl);
      ivl = setInterval(function() {
        client.emit('ping');
      }, 30 * 1000);
    });
    client.on('broadcast', function(data){
      // Invalid message
      if (!data.payload) {
        return;
      }

      // Ignore own messages
      if (data.source === myNick) {
        return;
      }

      console.log('Chat: Received: ' + data.source + ': ' + data.payload);

      receive(data.source, data.payload);
    });
    client.on('disconnect', function() {
      console.log('Chat: Disconnected');

      clearInterval(ivl);

      if (!shutdown) {
        setTimeout(function() {
          connect();
        }, 1000);
      }
    });
  },
  stop: function() {
    shutdown = true;

    client.close();
  },
  send: function(nick, content) {
    if (!content || content === '') {
      return;
    }

    myNick = nick;

    client.emit('message', nick, content);
  }
};

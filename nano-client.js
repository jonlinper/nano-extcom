'use strict';

var config = require('./config');
var net = require('net');

var client;
var shutdown = false;
var connected = false;

var connect = function() {
  client.connect(config.tcpServer.port, config.tcpServer.ip);
};

/**
 * Expose config.
 */
module.exports = {
  start: function(receive) {
    var buffer = '';

    client = new net.Socket();

    connect();

    client.on('connect', function() {
      console.log('Nano: Connected');

      connected = true;
    });

    client.on('data', function(data) {
      var pos;
      var command;
      var dataStr = data.toString('utf8');

      buffer += dataStr;

      pos = buffer.indexOf(';');

      // Not entire data
      if (pos === -1) {
        return;
      }

      command = buffer.substring(0, pos);
      buffer = buffer.substring(pos + 1);

      console.log('Nano: Received: ' + command);

      receive(command);
    });

    client.on('close', function() {
      console.log('Nano: Disconnected');

      if (!shutdown) {
        setTimeout(function() {
          connect();
        }, 1000);
      }
    });

    client.on('error', function(err){
      console.log('Nano: Error: ' + err.message);

      if (!shutdown && !connected) {
        setTimeout(function() {
          connect();
        }, 1000);
      }
    });
  },
  stop: function() {
    shutdown = true;

    client.destroy();
  },
  send: function(command) {
    var buff;

    console.log('Nano: Send: ' + command);

    buff = new Buffer(command + ';', 'utf8');

    client.write(buff.toString('ascii'));
  }
};

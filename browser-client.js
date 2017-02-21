'use strict';

var request = require('request');
var htmlToText = require('html-to-text');

/**
 * Expose config.
 */
module.exports = {
  get: function(address, done) {
  	console.log('Browser: Get: ' + address);

  	request(address, function (error, response, body) {
	  if (error || response.statusCode !== 200) {
	  	return done('Error');
	  }

	  done(null, htmlToText.fromString(body, { wordwrap: 80 }).replace(/(?:\r\n|\r|\n)/g, '\n\r'));
	});
  }
};

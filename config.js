'use strict';

/**
 * Expose config.
 * @type {Object}
 */
module.exports = {
	tcpServer: {
		ip: process.env.NANO_IP,
		port: process.env.NANO_PORT
	},
	chatAddress: process.env.CHAT_ADDRESS
};

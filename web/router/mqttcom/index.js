const api = require('./api')


const Routes = [
	{
		method: 'POST',
		path: 'mqtt',
		handler: api.mqttHandler,
		config: {
			auth: false,
		}
	}
];

module.exports = Routes;
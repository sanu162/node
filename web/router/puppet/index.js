const api = require('./api')


const Routes = [
	{
		method: 'GET',
		path: 'ppt',
		handler: api.Handler,
		config: {
			auth: false,
		}
	}
];

module.exports = Routes;
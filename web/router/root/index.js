const api = require('./api')


const Routes = [
	{
		method: 'GET',
		path: '/',
		handler: api.rootHandler,
		config: {
			auth: false,
		}
	}
];

module.exports = Routes;
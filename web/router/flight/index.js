const api = require('./api')


const Routes = [

	{
		method: 'GET',
		path: 'auth/flight',
		handler: api.getFlight,
		options: {
			auth:'my_jwt_strategy',
		}
	},

];

module.exports = Routes;
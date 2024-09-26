const { options } = require('joi');
const api = require('./api')


const Routes = [
    {
		method: 'POST',
		path: 'person',
		handler: api.createPerson,
		config: {
			tags: ['api', 'person'],
		// 	// description: ('apiDescription'),
		// 	// notes: i18n.__('apiNotes').test,
			auth: false,
		// 	// response: api.response,
			validate: {
				payload: api.personInput,
				// headers: headerLan,
				// failAction,
			},
		},
	},

	{
		method: 'GET',
		path: 'person',
		handler: api.getPersons,
		options: {
			auth: false,
			tags : ['api','person'],
			description : "get all the persons"
		}
	},

	{
		method: 'GET',
		path: 'auth/person',
		handler: api.getPersonById,
		options: {
			auth:'my_jwt_strategy',
			tags : ['api','person'],
			description : "get the logged in person"
		}
	},

	{
		method: 'PUT',
		path: 'auth/person/{id}',
		handler: api.updatePerson,
		options: {
			auth:'my_jwt_strategy',
			validate: {
				query: api.query,
			},
			tags : ['api','person'],
			description : "update the person"
		}
	},

	{
		method: 'DELETE',
		path: 'auth/person/{id}',
		handler: api.deletePerson,
		options: {
			auth:'my_jwt_strategy',
			validate: {
				query: api.query,
			},
			tags : ['api','person'],
			description : "delete the person"
		}
	},

	{
		method: 'POST',
		path: 'person/forgot',
		handler: api.forgotPassword,
		options: {
			auth: false,
		}
	},

	{
		method: 'POST',
		path: 'person/reset',
		handler: api.resetPassword,
		options: {
			auth:'my_jwt_strategy',
		}
	},

	{
		method: 'POST',
		path: 'auth/person/login',
		handler: api.login,
		config: {
			auth: false,
			validate: {
				payload: api.loginInput	,
			},
			tags : ['api','person'],
			description : "user login"
		},
	},

	{
		method: 'POST',
		path: 'auth/person/refresh',
		handler: api.refreshToken,
		config: {
			auth: false,
			validate: {
				payload: api.refreshTokenPayload,
			},
			tags : ['api','person'],
			description : "refresh the token"
		},
	},

];

module.exports = Routes;
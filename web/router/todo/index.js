const api = require('./api')


const Routes = [
    {
		method: 'POST',
		path: 'auth/person/todo',
		handler: api.createTodo,
		options: {
			tags: ['person', 'todo'],
			auth:'my_jwt_strategy',
			validate: {
				payload: api.todoPayload,
			},
		},
	},

	{
		method: 'GET',
		path: 'auth/person/todo',
		handler: api.getTodo,
		options: {
			auth:'my_jwt_strategy',
		}
	},

	{
		method: 'DELETE',
		path: 'auth/person/todo/{id}',
		handler: api.deleteTodo,
		options: {
			auth:'my_jwt_strategy',
		}
	},

];

module.exports = Routes;
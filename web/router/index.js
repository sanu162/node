const person = require('./person');
const root = require('./root')
const todo = require('./todo')

const register = (server, options) => {
    const routes = [
        ...person,
        ...todo,
        ...root
    ]

    server.route(routes)

}


exports.plugin = {
    name : 'base-routes',
    version : '1.0.0',
    register
}
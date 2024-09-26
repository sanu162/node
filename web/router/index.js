const person = require('./person');
const root = require('./root')
const todo = require('./todo')
const flight = require('./flight')

const register = (server, options) => {
    const routes = [
        ...person,
        ...todo,
        ...root,
        ...flight,
    ]

    server.route(routes)

}


exports.plugin = {
    name : 'base-routes',
    version : '1.0.0',
    register
}
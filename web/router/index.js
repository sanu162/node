const person = require('./person');
const root = require('./root')
const todo = require('./todo')
const flight = require('./flight')
const ppt = require('./puppet')
const mqtt = require('./mqttcom')

const register = (server, options) => {
    const routes = [
        ...person,
        ...todo,
        ...root,
        ...flight,
        ...ppt,
        ...mqtt
    ]

    server.route(routes)

}


exports.plugin = {
    name : 'base-routes',
    version : '1.0.0',
    register
}
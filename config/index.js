const mongodb = require('./components/mongodb');
const server = require('./components/server');

module.exports = {
    ...mongodb,
    ...server
}
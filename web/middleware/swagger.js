const inert = require('@hapi/inert')
const vision = require('@hapi/vision')
const hapiSwagger = require('hapi-swagger')
const pkg = require('../../package.json')

const swagger = {
    plugin : hapiSwagger,
    options : {
        schemes: ['http', 'https'],
        info: {
            title: 'API Documentation',
            version: pkg.version,
        },
        grouping: 'tags',
        tags: [
            { name: 'example', description: 'Example API' },
        ],
    },
}


module.exports = { inert, vision, swagger }
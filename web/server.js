const hapi = require('@hapi/hapi')
const config = require('../config')
const db = require("../library/mongodb")
const { verifyAccessToken } = require("./common/jwtHelper");
const middleware = require("./middleware")
const jwt = require('@hapi/jwt')


const server = hapi.server({
    port: config.server.PORT,
    host: '0.0.0.0',
    routes: {
		cors: {
			origin: ['*'],
			additionalHeaders: ['lan'],
		},
    },
});

exports.init = async () => {
    await server.register(jwt)
    server.auth.strategy('my_jwt_strategy', 'jwt',{
        keys :  process.env.JWT_ACCESS_SECRET,
        verify: false,
        validate : verifyAccessToken
    }),
    

    await server.register([
        middleware.swagger.inert,
        middleware.swagger.vision,
        middleware.swagger.swagger,
        {
			plugin: require('./router'),
			routes: {
				prefix: `/api/`,
			},
		},
    ])
    
    await server.initialize();
    return server;
};

exports.start = async () => {

    try {
        await db.connect();
        await server.start();
        console.log(`server is running by process id ${process.pid}`);
    } catch (error) {
        console.log(`${error.message}`);
        process.exit(1)
    }
    return server

}


exports.stop = async () => {
    await server.stop();
}
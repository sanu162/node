const joi = require('joi');

const envVarsSchema = joi.object({
    PORT: joi.number().required(),
}).unknown()
    .required();


const {error, value: envVars} = envVarsSchema.validate({PORT: process.env.PORT} , 'Config validation failed');
if (error) {
    throw new Error(`Config validation failed: ${error.message}`);
}

const config = {
    server: {
        PORT: envVars.PORT,
    },
};

module.exports = config
const joi = require('joi');

const envVarsSchema = joi.object({
    MONGO_URL: joi.string().required(),
}).unknown()
    .required();
    

const {error, value: envVars} = envVarsSchema.validate({MONGO_URL: process.env.MONGO_URL} , 'Config validation failed');
if (error) {
    console.log(envVars.MONGO_URL);
        
    throw new Error(`Config validation failed: ${error}`);
}

const config = {
    mongodb: {
        url: envVars.MONGO_URL,
    },
};


module.exports = config
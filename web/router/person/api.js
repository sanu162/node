const joi = require('joi');
const mongoose = require('mongoose')
const personSchema = require('../../../models').person
const bcrypt = require('bcryptjs')
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../../common/jwtHelper')

const query = joi.object({
    id : joi.string().error(new Error('invalid id...')),
})

const personInput = joi.object({
    name : joi.string().required().description("name").error(new Error('name is required..')),
    age : joi.number().description("age").required().error(new Error('age is required..')),
    email : joi.string().description("email").email().required().error(new Error('email is required..')),
    password : joi.string().description("password").required().error(new Error('password is missing..'))
})

const loginInput = joi.object({
    email : joi.string().description("email").email().required().error(new Error('email is required..')),
    password : joi.string().description("password").required().error(new Error('password is missing..'))
})

const refreshTokenPayload = joi.object({
    refresh_token : joi.string().description("refresh_token").required().error(new Error("refresh_token required.."))
})


const createPerson = async (req, h) => {
    try {             
        const {email} = req.payload

        const exisitngPerson = await personSchema.findOne({ email });
        if (exisitngPerson) return h.response({message:"Person already exists.."}).code(409);

        const person = await personSchema.create(req.payload)
        return h.response(person).code(200)

    } catch (error) {
        return h.response({message:error.message}).code(400)
    }
}

const getPersons = async (req, h) => {
    try {
        const persons = await personSchema.find()
        return h.response({data:persons}).code(200)
    } catch (error) {
        return h.response({message:error.message}).code(400)
    }
}   

const getPersonById = async (req, h) => {
    try {
        const {personId} = req

        if (mongoose.Types.ObjectId.isValid(personId)){
            const person = await personSchema.findById(personId);
            if (!person) return h.response({message:"No data found!"}).code(204);

            return h.response({data:person}).code(200);
        } else {
            return h.response({message:"id is not valid."}).code(400);
        }
    
    } catch (error) {
        return h.response({message:error.message}).code(400)
    }
}

const updatePerson = async (req, h) => {
    try {
        const {id} = req.params;

        if (mongoose.Types.ObjectId.isValid(id)){
            const persons = await personSchema.findByIdAndUpdate(id, req.payload);            
            if (!persons) return h.response({message: "Person not found"}).code(404);

            return h.response({data:persons}).code(200);
        } else {
            return h.response({message:"id is not valid."}).code(400)
        }

    } catch (error) {
        return h.response({message:error.message}).code(400)
    }
}

const deletePerson = async (req, h) => {
    try {

        const {id} = req.params;

        if (mongoose.Types.ObjectId.isValid(id)){

            await personSchema.findByIdAndDelete(id);
            return h.response({message:"Person Deleted!!"}).code(204);

        } else {

            return h.response({message:"id is not valid!!"}).code(400);

        }

    } catch (error) {
        return h.response({message:error.message}).code(400);
    }
}

const login = async (req, h) => {
    try {
        const {email ,password} = req.payload

        const exisitngPerson = await personSchema.findOne({ email })
        if (!exisitngPerson) return h.response({message:"Email not registered"}).code(404);
        

        const validatePassword = await bcrypt.compare(password, exisitngPerson.password);
        if (validatePassword) {

            const accessToken = await signAccessToken(exisitngPerson._id)
            const refreshToken = await signRefreshToken(exisitngPerson._id)

            return h.response({message:"Login Successfully", accessToken: accessToken, refreshToken: refreshToken}).code(200);
        } else{
            return h.response({message:"Invalid Passsword"}).code(401);
        }

    } catch (error) {
        return h.response({message:error.message}).code(400);
    }
}

const refreshToken = async (req, h) => {
    try {
        const { refresh_token } = req.payload;
        if (!refresh_token) {
            return h.response({message:"invalid refresh token."}).code(404);
        }
        
        const personId = await verifyRefreshToken(refresh_token);
        
        const accessToken = await signAccessToken(personId)
        const refreshToken = await signRefreshToken(personId)
        
        return h.response({
            accessToken : accessToken, 
            refreshToken : refreshToken
        }).code(200);
    } catch (error) {
        return h.response({message:error.message}).code(400);
    }
}

module.exports = {
    personInput,
    loginInput,
    refreshTokenPayload,
    query,
    createPerson,
    getPersons,
    getPersonById,
    updatePerson,
    deletePerson,
    login,
    refreshToken,
}
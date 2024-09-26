const joi = require('joi');
const mongoose = require('mongoose')
const personSchema = require('../../../models').person
const otpSchema = require('../../../models').otp
const bcrypt = require('bcryptjs')
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../../common/jwtHelper')
const { transporter } = require('../../common/mailHelper');
const { otp } = require('../../../models');
const { error } = require('winston');

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

const sendMail = (personInstance, otp) => {
    const info =  transporter.sendMail({
        from : process.env.AUTH_EMAIL,
        to : personInstance.email,
        subject : "OTP for mail registration",
        html : "<b>"+ otp +"</b>"
    });

    return info
}

const forgotPassword = async (req, h) => {
    try{
        const { email } = req.payload;
        const otp = Math.floor((Math.random() * 90000) + 10000);

        const exisitngPerson = await personSchema.findOne({ email });
        if (!exisitngPerson) return h.response({message:"email not registered"}).code(409);

        const mail = await sendMail(exisitngPerson, otp)
        let accessToken;
        if (mail){
            accessToken = await signAccessToken(exisitngPerson._id)
        }

        const newotpSchema = new otpSchema ({
            user_id:exisitngPerson._id,
            otp:otp,
            created_at:Date.now(),
            expires_at:Date.now()+300000
        });

        const createOtp = otpSchema.create(newotpSchema)
        if (createOtp){
            return h.response({message:"otp sent",accessToken:accessToken})
        } else {
            return h.response({message:"error while inserting otp"}).code(400)
        }
        
    } catch (error) {
        return h.response({message:error.message}).code(400);
    }
}

const resetPassword  = async (req, h) => {
    try {
        const { otp, password } = req.payload;
        const { personId } = req;

        console.log(personId);
        

        const existingOtp = await otpSchema.findOne({ user_id:personId });
        if (!existingOtp) return h.response({message:"otp not found for you! Please send otp then try later."}).code(409);

        if (otp == existingOtp.otp) {

            const updatePerson = await personSchema.updateOne({_id:personId}, {password:password})
            if (updatePerson) {
                await otpSchema.findByIdAndDelete(existingOtp._id);

                return h.response({message:"success"}).code(200)
            }

            return h.response({message:updatePerson}).code(200)
            
        }
        return h.response({message:"otp unmatched"}).code(200)
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
    forgotPassword,
    resetPassword,
    login,
    refreshToken,
}
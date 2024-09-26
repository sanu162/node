const mongoose = require('mongoose')


const OtpSchema = mongoose.Schema(
    {
        user_id:{
            type:String,
        },

        otp:{
            type:String
        },

        created_at:Date,
        expires_at:Date
    }
);

const Otp = mongoose.model('Otp',OtpSchema);

module.exports = Otp;
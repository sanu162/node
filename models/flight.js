const mongoose = require('mongoose')


const FlightSchema = mongoose.Schema(
    {
        booking_no:{
            type:String,
        },

        first_name:{
            type:String,
        },

        last_name:{
            type:String,
        },

        dob:{
            type:Date,
        },

        email:{
            type:String,
        },

        origin:{
            type:String,
        },

        destination:{
            type:String,
        },
    }
);

const Flight = mongoose.model('Flight',FlightSchema);

module.exports = Flight;
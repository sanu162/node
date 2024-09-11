const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const SALT_ROUND=10

const PersonSchema = mongoose.Schema(
    {
        name:{
            type:String,
        },

        age:{
            type:Number,
        },

        email:{
            type:String,
        },

        password:{
            type:String,
        },
    },
    {
        timestamps:true,
    }
);


PersonSchema.pre("save", async function(next) {
    var person = this

    if (!person.isModified('password')) return next()

    try {
        const salt = await bcrypt.genSalt(SALT_ROUND)
        const hash = await bcrypt.hash(person.password, salt)

        person.password = hash
    } catch (error) {
        next(error)
    }
})

const Person = mongoose.model('Person',PersonSchema);

module.exports = Person;
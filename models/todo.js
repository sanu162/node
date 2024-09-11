const mongoose = require('mongoose')


const TodoSchema = mongoose.Schema(
    {
        name:{
            type:String,
        },

        description:{
            type:String,
            default:'A todo waiting to be done.'
        },

        completed:{
            type:Boolean,
            default:false
        },

        assignedPersonId:{
            type:String,
        },
    },
    {
        timestamps:true,
    }
);

const Todo = mongoose.model('Todo',TodoSchema);

module.exports = Todo;
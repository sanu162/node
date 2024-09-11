const joi = require('joi');
const todoSchema = require('../../../models').todo


const todoPayload = joi.object({
    name : joi.string().required().description("name").error(new Error('name is required..')),
    description : joi.string().description("description"),
    completed : joi.boolean().description("completed"),
})


const createTodo = async (req, h) => {
    try{        
        const { personId } = req
        const {name, description, completed} = req.payload

        if (personId) {

            const query = { assignedPersonId:personId, name:name };
            const update = {$set: {
                name:name,
                description:description,
                completed:completed,
                assignedPersonId: personId,
            } };
            const options = {upsert : true};

            const todo = await todoSchema.updateOne(query, update, options);
            // {
            //     "acknowledged": true,
            //     "modifiedCount": 1,
            //     "upsertedId": null,
            //     "upsertedCount": 0,
            //     "matchedCount": 1
            // }
            // {
            //     "acknowledged": true,
            //     "modifiedCount": 0,
            //     "upsertedId": "66e1314c355d0dc1b562ca71",
            //     "upsertedCount": 1,
            //     "matchedCount": 0
            // }

            if(todo.upsertedCount > 0){
                return h.response({message:'The todo added!!'}).code(201);
            };
            
            return h.response(checkTodo).code(200);
        } else {
            return h.response({message: "Please provide assigned person id of the todo.."}).code(422);
        }
                
    }
    catch (err){
        return h.response({message: err.message}).code(500);
    }
}

const getTodo = async (req, h) => {
    try {
        const { personId } = req
        if (personId){

            const todos = await todoSchema.find({assignedPersonId:personId},{
                name: 1,
                description: 1,
                _id: 1, 
            })        
            
            return h.response({data:todos}).code(200)
        } else {
            return h.response({message: "Please provide assigned person id of the todo.."}).code(422);
        }
    } catch (error) {
        return h.response({message:error.message}).code(400)
    }
}

const deleteTodo = async (req, h) => {
    try {
        const {id} = req.params;
        const todos = await todoSchema.findByIdAndDelete(id);

        if (!todos){
            return res.status(404).json({message: "Todo not found"});
        }

        return h.response({message:"Todo deleted"}).code(200)

    } catch (error) {
        return h.response({message:error.message}).code(400)
    }
}

module.exports = {
    todoPayload,
    createTodo,
    getTodo,
    deleteTodo,
}